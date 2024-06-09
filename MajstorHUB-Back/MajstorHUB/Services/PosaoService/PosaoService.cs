using MajstorHUB.Models.Poslovi;
using MajstorHUB.Models.Users;
using MajstorHUB.Responses.Posao;

namespace MajstorHUB.Services.PosaoService;

public class PosaoService : IPosaoService
{
    private readonly IMongoCollection<Posao> _poslovi;
    private readonly IMongoCollection<Korisnik> _korisnici;
    private readonly IMongoCollection<Majstor> _majstori;
    private readonly IMongoCollection<Firma> _firme;
    private readonly IMongoCollection<Oglas> _oglasi;

    public PosaoService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _poslovi = db.GetCollection<Posao>(settings.PosloviCollectionName);
        _korisnici = db.GetCollection<Korisnik>(settings.KorisniciCollectionName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);
        _majstori = db.GetCollection<Majstor>(settings.MajstoriCollectionName);
        _oglasi = db.GetCollection<Oglas>(settings.OglasiCollectionName);
    }

    private GetByZapocetiDTO ProjectToGetByZapocet(Posao posao, Korisnik korisnik, User user)
    {
        var userType = posao.Izvodjac.TipIzvodjaca;
        if (userType == Roles.Firma && user is not Firma)
            throw new NotSupportedException("Niste uneli firmu a tip izvodjaca vam je firma");
        if (userType == Roles.Majstor && user is not Majstor)
            throw new NotSupportedException("Niste uneli majstora a tip izvodjaca vam je majstor");

        switch (userType)
        {
            case Roles.Firma:
                var firma = user as Firma;
                if (firma == null)
                    throw new Exception("Nismo uspeli da castujemo user-a u firmu");

                return new GetByZapocetiDTO
                {
                    Cena = posao.DetaljiPosla.Cena,
                    Opis = posao.DetaljiPosla.Opis,
                    IzvodjacNaziv = firma.Naziv,
                    KorisnikNaziv = korisnik.Ime + ' ' + korisnik.Prezime,
                    PocetakRadova = posao.PocetakRadova,
                    TipIzvodjaca = userType,
                    ZavrsetakRadova = posao.ZavrsetakRadova
                };
            case Roles.Majstor:
                var majstor = user as Majstor;
                if (majstor == null)
                    throw new Exception("Nismo uspeli da castujemo user-a u majstora");

                return new GetByZapocetiDTO
                {
                    Cena = posao.DetaljiPosla.Cena,
                    Opis = posao.DetaljiPosla.Opis,
                    IzvodjacNaziv = majstor.Ime + ' ' + majstor.Prezime,
                    KorisnikNaziv = korisnik.Ime + ' ' + korisnik.Prezime,
                    PocetakRadova = posao.PocetakRadova,
                    TipIzvodjaca = userType,
                    ZavrsetakRadova = posao.ZavrsetakRadova
                };
            default:
                throw new NotSupportedException("Tip koji je prosledjen nije podrzan!\n");
        }
    }

    private class GetBeforeJoinDTO
    {
        public required List<Korisnik> Korisnici { get; set; }
        public required List<User> Izvodjaci { get; set; }
        public required List<Posao> Poslovi { get; set; }
    }

    private async Task<GetBeforeJoinDTO> GetUsersBeforeJoin(string userId, Roles userType, bool zapocet)
    {
        var filterBuilder = Builders<Posao>.Filter;
        var majstorFilterBuilder = Builders<Majstor>.Filter;
        var firmaFilterBuilder = Builders<Firma>.Filter;
        var korisnikFilterBuilder = Builders<Korisnik>.Filter;

        var zavrsenFilter = filterBuilder.Eq(p => p.Zavrsen, zapocet);
        FilterDefinition<Posao> filter;
        if (userType == Roles.Korisnik)
        {
            filter = filterBuilder.And(
                filterBuilder.Eq(p => p.Korisnik, userId),
                zavrsenFilter);
        }
        else if (userType == Roles.Majstor || userType == Roles.Firma)
        {
            filter = filterBuilder.And(
                filterBuilder.Eq(p => p.Izvodjac.IzvodjacId, userId),
                zavrsenFilter);
        }
        else
            throw new NotSupportedException("Prosledjen tip korisnika nije podrzan");

        var poslovi = await _poslovi.Find(filter).ToListAsync();

        var majstoriIds = (from posao in poslovi
                           where posao.Izvodjac.TipIzvodjaca is Roles.Majstor
                           select posao.Izvodjac.IzvodjacId).ToList();

        var firmeIds = (from posao in poslovi
                        where posao.Izvodjac.TipIzvodjaca is Roles.Firma
                        select posao.Izvodjac.IzvodjacId).ToList();

        List<User> izvodjaci = [];
        var majstorFilter = majstorFilterBuilder.In(m => m.Id, majstoriIds);
        var firmaFilter = firmaFilterBuilder.In(f => f.Id, firmeIds);

        var majstori = await _majstori.Find(majstorFilter).ToListAsync();
        var firme = await _firme.Find(firmaFilter).ToListAsync();

        izvodjaci.AddRange(majstori);
        izvodjaci.AddRange(firme);

        var korisniciIds = (from posao in poslovi
                            select posao.Korisnik).ToList();
        var korisnikFilter = korisnikFilterBuilder.In(k => k.Id, korisniciIds);
        var korisnici = await _korisnici.Find(korisnikFilter).ToListAsync();

        return new GetBeforeJoinDTO
        {
            Izvodjaci = izvodjaci,
            Korisnici = korisnici,
            Poslovi = poslovi
        };
    }

    public async Task<List<Posao>> GetAll()
    {
        return await _poslovi.Find(posao => true).ToListAsync();
    }

    public async Task<Posao> GetById(string id)
    {
        return await _poslovi.Find(posao => posao.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Posao> GetByOglas(string oglasId)
    {
        return await _poslovi.Find(posao => posao.Oglas == oglasId).FirstOrDefaultAsync();
    }

    public async Task<List<GetByZapocetiDTO>> GetByUserZapoceti(string userId, Roles userType)
    {
        var before = await GetUsersBeforeJoin(userId, userType, false);
        var poslovi = before.Poslovi;
        var izvodjaci = before.Izvodjaci;
        var korisnici = before.Korisnici;

        var result = (from posao in poslovi
                      join izvodjac in izvodjaci on posao.Izvodjac.IzvodjacId equals izvodjac.Id
                      join korisnik in korisnici on posao.Korisnik equals korisnik.Id
                      select ProjectToGetByZapocet(posao, korisnik, izvodjac)
                      ).ToList();

        return result;
    }

    //public async Task<List<GetByZapocetiDTO>> GetByUserZavrseni(string userId, Roles userType)
    //{

    //}

    public async Task Create(Posao posao)
    {
        await _poslovi.InsertOneAsync(posao);

        var oglasFilter = Builders<Oglas>.Filter.Eq(o => o.Id, posao.Oglas);
        var updateOglas = Builders<Oglas>.Update.Set(o => o.Active, false);
        await _oglasi.UpdateOneAsync(oglasFilter, updateOglas);

        var korisnikFilter = Builders<Korisnik>.Filter.Eq(k => k.Id, posao.Korisnik);
        var updateKorisnik = Builders<Korisnik>.Update
            .Push(k => k.Poslovi, posao.Id)
            .Inc(k => k.NovacNaSajtu, -posao.DetaljiPosla.Cena);
        await _korisnici.UpdateOneAsync(korisnikFilter, updateKorisnik);

        if (posao.Izvodjac.TipIzvodjaca == Roles.Majstor)
        {
            var filter = Builders<Majstor>.Filter.Eq(m => m.Id, posao.Izvodjac.IzvodjacId);
            var update = Builders<Majstor>.Update
                .Push(m => m.Poslovi, posao.Id);

            await _majstori.UpdateOneAsync(filter, update);
        }
        else if (posao.Izvodjac.TipIzvodjaca == Roles.Firma)
        {
            var filter = Builders<Firma>.Filter.Eq(f => f.Id, posao.Izvodjac.IzvodjacId);
            var update = Builders<Firma>.Update
                .Push(f => f.Poslovi, posao.Id);

            await _firme.UpdateOneAsync(filter, update);
        }
        else
            throw new NotSupportedException("Prosledjen tip nije majstor ili firma");
    }

    public async Task ZavrsiByKorisnik(ZavrsiPosaoDTO zavrsi)
    {
        var posaoFilter = Builders<Posao>.Filter.Eq(p => p.Id, zavrsi.Posao);
        var recenzijaUpdate = Builders<Posao>.Update
                    .Set(o => o.Recenzije.RecenzijaKorisnika, zavrsi.recenzija);

        var posao = await _poslovi.FindOneAndUpdateAsync(posaoFilter, recenzijaUpdate);

        if (posao.Recenzije.RecenzijaIzvodjaca is not null)
        {
            var zavrsiUpdate = Builders<Posao>.Update
                    .Set(o => o.Zavrsen, true);
            await _poslovi.UpdateOneAsync(posaoFilter, zavrsiUpdate);
        }

    }
    public async Task ZavrsiByIzvodjac(ZavrsiPosaoDTO zavrsi)
    {
        var posaoFilter = Builders<Posao>.Filter.Eq(p => p.Id, zavrsi.Posao);
        var recenzijaUpdate = Builders<Posao>.Update
                    .Set(p => p.Recenzije.RecenzijaIzvodjaca, zavrsi.recenzija);

        var posao = await _poslovi.FindOneAndUpdateAsync(posaoFilter, recenzijaUpdate);

        if (posao.Recenzije.RecenzijaKorisnika is not null)
        {
            var zavrsiUpdate = Builders<Posao>.Update
                    .Set(p => p.Zavrsen, true);
            await _poslovi.UpdateOneAsync(posaoFilter, zavrsiUpdate);
        }
    }

    public async Task Delete(string id)
    {
        var posao = await _poslovi.FindOneAndDeleteAsync(posao => posao.Id == id);
        if (posao is not null)
        {
            var oglasFilter = Builders<Oglas>.Filter.Eq(o => o.Id, posao.Oglas);
            var updateOglas = Builders<Oglas>.Update.Set(o => o.Active, true);
            await _oglasi.UpdateOneAsync(oglasFilter, updateOglas);

            var korisnikFilter = Builders<Korisnik>.Filter.Eq(k => k.Id, posao.Korisnik);
            var updateKorisnik = Builders<Korisnik>.Update
                .Pull(k => k.Poslovi, posao.Id)
                .Inc(k => k.NovacNaSajtu, posao.DetaljiPosla.Cena);
            await _korisnici.UpdateOneAsync(korisnikFilter, updateKorisnik);

            if (posao.Izvodjac.TipIzvodjaca == Roles.Majstor)
            {
                var filter = Builders<Majstor>.Filter.Eq(m => m.Id, posao.Izvodjac.IzvodjacId);
                var update = Builders<Majstor>.Update
                    .Pull(m => m.Poslovi, posao.Id);

                await _majstori.UpdateOneAsync(filter, update);
            }
            else if (posao.Izvodjac.TipIzvodjaca == Roles.Firma)
            {
                var filter = Builders<Firma>.Filter.Eq(f => f.Id, posao.Izvodjac.IzvodjacId);
                var update = Builders<Firma>.Update
                    .Pull(f => f.Poslovi, posao.Id);

                await _firme.UpdateOneAsync(filter, update);
            }
            else
                throw new NotSupportedException("Prosledjen tip nije majstor ili firma");
        }
    }
}
