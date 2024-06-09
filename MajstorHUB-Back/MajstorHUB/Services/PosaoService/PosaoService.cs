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
    private readonly ProjectionDefinition<Posao, GetZavrseniPosloviDTO> _getZavrseniProjection;
    private readonly IPrijavaService _prijavaService;


    public PosaoService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient, IPrijavaService prijavaService)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _poslovi = db.GetCollection<Posao>(settings.PosloviCollectionName);
        _korisnici = db.GetCollection<Korisnik>(settings.KorisniciCollectionName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);
        _majstori = db.GetCollection<Majstor>(settings.MajstoriCollectionName);
        _oglasi = db.GetCollection<Oglas>(settings.OglasiCollectionName);
        _prijavaService = prijavaService;

        _getZavrseniProjection = Builders<Posao>.Projection.Expression(p => new GetZavrseniPosloviDTO
        {
            DetaljiPosla = p.DetaljiPosla,
            Izvodjac = p.Izvodjac,
            Korisnik = p.Korisnik,
            Oglas = p.Oglas,
            PocetakRadova = p.PocetakRadova,
            Recenzije = p.Recenzije,
            ZavrsetakRadova = p.ZavrsetakRadova
        });
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
                    PosaoId = posao.Id!,
                    Cena = posao.DetaljiPosla.Cena,
                    Naslov = posao.DetaljiPosla.Naslov,
                    IzvodjacNaziv = firma.Naziv,
                    KorisnikNaziv = korisnik.Ime + ' ' + korisnik.Prezime,
                    PocetakRadova = posao.PocetakRadova,
                    TipIzvodjaca = userType,
                    ZavrsetakRadova = posao.ZavrsetakRadova,
                    Izvodjac = posao.Izvodjac.IzvodjacId,
                    Korisnik = posao.Korisnik,
                    Oglas = posao.Oglas,
                    Recenzije = posao.Recenzije
                };
            case Roles.Majstor:
                var majstor = user as Majstor;
                if (majstor == null)
                    throw new Exception("Nismo uspeli da castujemo user-a u majstora");

                return new GetByZapocetiDTO
                {
                    PosaoId = posao.Id!,
                    Cena = posao.DetaljiPosla.Cena,
                    Naslov = posao.DetaljiPosla.Naslov,
                    IzvodjacNaziv = majstor.Ime + ' ' + majstor.Prezime,
                    KorisnikNaziv = korisnik.Ime + ' ' + korisnik.Prezime,
                    PocetakRadova = posao.PocetakRadova,
                    TipIzvodjaca = userType,
                    ZavrsetakRadova = posao.ZavrsetakRadova,
                    Izvodjac = posao.Izvodjac.IzvodjacId,
                    Korisnik = posao.Korisnik,
                    Oglas = posao.Oglas,
                    Recenzije = posao.Recenzije
                };
            default:
                throw new NotSupportedException("Tip koji je prosledjen nije podrzan!\n");
        }
    }

    private GetZavrseniPosloviDTO ProjectToGetByZavrsen(Posao posao)
    {
        return new GetZavrseniPosloviDTO
        {
            DetaljiPosla = posao.DetaljiPosla,
            Izvodjac = posao.Izvodjac,
            Korisnik = posao.Korisnik,
            Oglas = posao.Oglas,
            PocetakRadova = posao.PocetakRadova,
            Recenzije = posao.Recenzije,
            ZavrsetakRadova = posao.ZavrsetakRadova
        };
    }

    private class GetBeforeJoinDTO
    {
        public required List<Korisnik> Korisnici { get; set; }
        public required List<User> Izvodjaci { get; set; }
        public required List<Posao> Poslovi { get; set; }
    }

    private async Task<List<Posao>> GetPosloviByUser(string userId, Roles userType, bool zapocet)
    {
        var filterBuilder = Builders<Posao>.Filter;

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

        return await _poslovi.Find(filter).ToListAsync();
    }

    private async Task<GetBeforeJoinDTO> GetUsersBeforeJoin(string userId, Roles userType, bool zapocet)
    {
        var filterBuilder = Builders<Posao>.Filter;
        var majstorFilterBuilder = Builders<Majstor>.Filter;
        var firmaFilterBuilder = Builders<Firma>.Filter;
        var korisnikFilterBuilder = Builders<Korisnik>.Filter;

        var poslovi = await GetPosloviByUser(userId, userType, zapocet);

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

    public async Task<List<GetZavrseniPosloviDTO>> GetByUserZavrseni(string userId, Roles userType)
    {
        var filterBuilder = Builders<Posao>.Filter;

        var zavrsenFilter = filterBuilder.Eq(p => p.Zavrsen, true);
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

        return await _poslovi.Find(filter).Project(_getZavrseniProjection).ToListAsync();
    }

    public async Task Create(Posao posao)
    {
        await _poslovi.InsertOneAsync(posao);

        var oglasFilter = Builders<Oglas>.Filter.Eq(o => o.Id, posao.Oglas);
        var updateOglas = Builders<Oglas>.Update.Set(o => o.Status, StatusOglasa.Zapocet);
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

    private async Task ZavrsiPosao(Posao posao, ZavrsiPosaoDTO zavrsi)
    {
        var posaoFilter = Builders<Posao>.Filter.Eq(p => p.Id, zavrsi.Posao);
        var zavrsiUpdate = Builders<Posao>.Update.Set(o => o.Zavrsen, true);
        await _poslovi.UpdateOneAsync(posaoFilter, zavrsiUpdate);

        var oglasFilter = Builders<Oglas>.Filter.Eq(o => o.Id, posao.Oglas);
        var oglasUpdate = Builders<Oglas>.Update.Set(o => o.Status, StatusOglasa.Zavrsen);
        var oglas = await _oglasi.FindOneAndUpdateAsync(oglasFilter, oglasUpdate);

        // obrsisi sve prijave za oglas
        foreach (var prijavaId in oglas.PrijaveIds)
        {
            await _prijavaService.Delete(prijavaId);
        }

        // izracunaj ocenu korisnika i povecaj ukupno potroseno
        var korisnikFilter = Builders<Korisnik>.Filter.Eq(k => k.Id, posao.Korisnik);
        var korisnik = await _korisnici.Find(korisnikFilter).FirstOrDefaultAsync();
        var poslovi = await _poslovi.Find(p => korisnik.Poslovi.Contains(p.Id!) && p.Zavrsen).ToListAsync();
        var ocene = (from poso in poslovi
                     select poso.Recenzije.RecenzijaIzvodjaca!.Ocena).ToList();
        var korisnikUpdate = Builders<Korisnik>.Update
                    .Set(k => k.Ocena, ocene.Average())
                    .Inc(k => k.Potroseno, posao.DetaljiPosla.Cena);
        await _korisnici.UpdateOneAsync(korisnikFilter, korisnikUpdate);
        

        // dodelji badgeve!!!!
        if (posao.Izvodjac.TipIzvodjaca == Roles.Firma)
        {
            var firmaFilter = Builders<Firma>.Filter.Eq(f => f.Id, posao.Izvodjac.IzvodjacId);
            var firma = await _firme.Find(firmaFilter).FirstOrDefaultAsync();
            var firmaPoslovi = await _poslovi.Find(f => firma.Poslovi.Contains(f.Id!) && f.Zavrsen).ToListAsync();
            var oceneFirme = (from poso in firmaPoslovi
                              select poso.Recenzije.RecenzijaKorisnika!.Ocena).ToList();

            var firmaUpdate = Builders<Firma>.Update.
                Inc(f => f.NovacNaSajtu, posao.DetaljiPosla.Cena)
                .Inc(f => f.Zaradjeno, posao.DetaljiPosla.Cena)
                .Set(f => f.Ocena, oceneFirme.Average());
            await _firme.UpdateOneAsync(firmaFilter, firmaUpdate);
        }
        else
        {
            var majstorFilter = Builders<Majstor>.Filter.Eq(f => f.Id, posao.Izvodjac.IzvodjacId);
            var majstor = await _majstori.Find(majstorFilter).FirstOrDefaultAsync();
            var majstoriPoslovi = await _poslovi.Find(p => majstor.Poslovi.Contains(posao.Id!) && p.Zavrsen).ToListAsync();
            var oceneMajstora = (from poso in majstoriPoslovi
                                 select poso.Recenzije.RecenzijaKorisnika!.Ocena).ToList();
            var majstorUpdate = Builders<Majstor>.Update.
                        Inc(f => f.NovacNaSajtu, posao.DetaljiPosla.Cena)
                        .Inc(m => m.Zaradjeno, posao.DetaljiPosla.Cena)
                        .Set(f => f.Ocena, oceneMajstora.Average());
            await _majstori.UpdateOneAsync(majstorFilter, majstorUpdate);
        }
    }

    public async Task ZavrsiByKorisnik(ZavrsiPosaoDTO zavrsi)
    {
        var posaoFilter = Builders<Posao>.Filter.Eq(p => p.Id, zavrsi.Posao);
        var recenzijaUpdate = Builders<Posao>.Update
                    .Set(o => o.Recenzije.RecenzijaKorisnika, zavrsi.recenzija);

        var posao = await _poslovi.FindOneAndUpdateAsync(posaoFilter, recenzijaUpdate);

        if (posao.Recenzije.RecenzijaIzvodjaca is not null)
        {
            await ZavrsiPosao(posao, zavrsi);
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
            await ZavrsiPosao(posao, zavrsi);
        }
    }

    public async Task Delete(string id)
    {
        var posao = await _poslovi.FindOneAndDeleteAsync(posao => posao.Id == id);
        if (posao is not null)
        {
            var oglasFilter = Builders<Oglas>.Filter.Eq(o => o.Id, posao.Oglas);
            var updateOglas = Builders<Oglas>.Update.Set(o => o.Status, StatusOglasa.Otvoren);
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
