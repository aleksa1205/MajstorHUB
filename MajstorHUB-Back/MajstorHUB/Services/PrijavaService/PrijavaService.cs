using MajstorHUB.Responses.Prijava;

namespace MajstorHUB.Services.PrijavaService;

public class PrijavaService : IPrijavaService
{
    private readonly IMongoCollection<Prijava> _prijave;
    private readonly IMongoCollection<Oglas> _oglasi;
    private readonly IMongoCollection<Majstor> _majstori;
    private readonly IMongoCollection<Firma> _firme;

    public PrijavaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _prijave = db.GetCollection<Prijava>(settings.PrijaveCollectionName);
        _oglasi = db.GetCollection<Oglas>(settings.OglasiCollectionName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);
        _majstori = db.GetCollection<Majstor>(settings.MajstoriCollectionName);
    }

    public static PrijavaWithIzvodjacDTO ProjectToPrijavaWithIzvodjac(Prijava prijava, User user, Oglas oglas)
    {
        var userType = prijava.TipIzvodjaca;
        if (userType == Roles.Firma && user is not Firma)
            throw new NotSupportedException("Niste uneli firmu a tip izvodjaca vam je firma");
        if (userType == Roles.Majstor && user is not Majstor)
            throw new NotSupportedException("Niste uneli majstora a tip izvodjaca vam je majstor");

        List<Struka> matchingStruke = [];
        switch (userType)
        {
            case Roles.Firma:
                var firma = user as Firma;
                if (firma != null)
                {
                    return new PrijavaWithIzvodjacDTO
                    {
                        DatumKreiranja = prijava.DatumKreiranja,
                        Id = prijava.Id!,
                        IzvodjacId = firma.Id!,
                        Opis = prijava.Opis ?? "",
                        Ponuda = prijava.Ponuda,
                        TipIzvodjaca = prijava.TipIzvodjaca,
                        Bid = prijava.Bid,
                        MatchingScore = UtilityCheck.CalculateMatchingScore(oglas, firma, prijava.Ponuda, userType, out matchingStruke),
                        MatchingStruke = matchingStruke,
                        CenaPoSatu = firma.CenaPoSatu,
                        Iskustvo = firma.Iskustvo,
                        Naziv = firma.Naziv,
                        Zaradjeno = firma.Zaradjeno,
                        Slika = firma.Slika,
                        Adresa = firma.Adresa,
                        Email = firma.Email,
                        BrojTelefona = firma.BrojTelefona
                    };
                }
                else
                    throw new Exception("Nismo uspeli da castujemo user-a u firmu");
            case Roles.Majstor:
                var majstor = user as Majstor;
                if (majstor != null)
                {
                    return new PrijavaWithIzvodjacDTO
                    {
                        DatumKreiranja = prijava.DatumKreiranja,
                        Id = prijava.Id!,
                        IzvodjacId = majstor.Id!,
                        Opis = prijava.Opis ?? "",
                        Ponuda = prijava.Ponuda,
                        TipIzvodjaca = prijava.TipIzvodjaca,
                        Bid = prijava.Bid,
                        MatchingScore = UtilityCheck.CalculateMatchingScore(oglas, majstor, prijava.Ponuda, userType, out matchingStruke),
                        MatchingStruke = matchingStruke,
                        CenaPoSatu = majstor.CenaPoSatu,
                        Iskustvo = majstor.Iskustvo,
                        Naziv = majstor.Ime + ' ' + majstor.Prezime,
                        Zaradjeno = majstor.Zaradjeno,
                        Slika = majstor.Slika,
                        Adresa = majstor.Adresa,
                        Email = majstor.Email,
                        BrojTelefona = majstor.BrojTelefona
                    };
                }
                else
                    throw new Exception("Nismo uspeli da castujemo user-a u majstora");
            default:
                throw new NotSupportedException("Tip koji je prosledjen nije podrzan!\n");
        }
    }

    public async Task<List<Prijava>> GetAll()
    {
        return await _prijave.Find(prijava => true).ToListAsync();
    }

    public async Task<Prijava> GetById(string id)
    {
        return await _prijave.Find(prijava => prijava.Id == id).FirstOrDefaultAsync();
    }

    // razlog zasto zahtevam oglas kao parametar je jer u kontroleru vec zovem getById za oglas id, pa da to ponove ne bi radio i u servisu
    // prosledjujem taj oglas kao parametar da ne bi bespotrebno smanjivao performanse ove metode
    public async Task<List<PrijavaWithIzvodjacDTO>> GetByOglas(string oglasId, Oglas? oglas)
    {
        var majstorFilterBuilder = Builders<Majstor>.Filter;
        var firmaFilterBuilder = Builders<Firma>.Filter;

        var prijave = await _prijave.Find(prijava => prijava.OglasId == oglasId).ToListAsync();
        var majstoriIds = prijave.Where(p => p.TipIzvodjaca == Roles.Majstor).Select(p => p.IzvodjacId).ToList();
        var firmeIds = prijave.Where(p => p.TipIzvodjaca == Roles.Firma).Select(p => p.IzvodjacId).ToList();

        List<User> izvodjaci = [];
        var majstorFilter = majstorFilterBuilder.In(m => m.Id, majstoriIds);
        var firmaFilter = firmaFilterBuilder.In(f => f.Id, firmeIds);

        var majstori = await _majstori.Find(majstorFilter).ToListAsync();
        var firme = await _firme.Find(firmaFilter).ToListAsync();

        izvodjaci.AddRange(majstori);
        izvodjaci.AddRange(firme);

        oglas ??= await _oglasi.Find(o => o.Id == oglasId).FirstOrDefaultAsync();

        List<PrijavaWithIzvodjacDTO> result = [];
        result = prijave.Join(
            izvodjaci,
            prijava => prijava.IzvodjacId,
            izvodjac => izvodjac.Id,
            (prijava, izvodjac) => ProjectToPrijavaWithIzvodjac(prijava, izvodjac, oglas))
            .OrderByDescending(r => r.MatchingScore)
            .ThenByDescending(r => r.Bid)
            .ToList();

        return result;
    }

    public async Task Create(Prijava prijava)
    {
        await _prijave.InsertOneAsync(prijava);

        var oglasFilter = Builders<Oglas>.Filter.Eq(x => x.Id, prijava.OglasId);
        var updateOglas = Builders<Oglas>.Update.Push(o => o.PrijaveIds, prijava.Id);
        await _oglasi.UpdateOneAsync(oglasFilter, updateOglas);

        if (prijava.TipIzvodjaca == Roles.Majstor)
        {
            var filter = Builders<Majstor>.Filter.Eq(m => m.Id, prijava.IzvodjacId);
            var update = Builders<Majstor>.Update
                .Push(m => m.OglasiId, prijava.OglasId)
                .Push(m => m.PrijaveNaPosao, prijava.Id)
                .Inc(m => m.NovacNaSajtu, -prijava.Bid);

            await _majstori.UpdateOneAsync(filter, update);
        }
        else if (prijava.TipIzvodjaca == Roles.Firma)
        {
            var filter = Builders<Firma>.Filter.Eq(f => f.Id, prijava.IzvodjacId);
            var update = Builders<Firma>.Update
                .Push(f => f.OglasiId, prijava.OglasId)
                .Push(f => f.PrijaveNaPosao, prijava.Id)
                .Inc(f => f.NovacNaSajtu, -prijava.Bid);

            await _firme.UpdateOneAsync(filter, update);
        }
        else
            throw new NotSupportedException("Prosledjen tip nije majstor ili firma");
    }

    public async Task Delete(string id)
    {
        var prijava = await _prijave.FindOneAndDeleteAsync(prijava => prijava.Id == id);
        if(prijava is not null)
        {
            var oglasFilter = Builders<Oglas>.Filter.Eq(x => x.Id, prijava.OglasId);
            var updateOglas = Builders<Oglas>.Update.Pull(o => o.PrijaveIds, prijava.Id);
            await _oglasi.UpdateOneAsync(oglasFilter, updateOglas);

            if (prijava.TipIzvodjaca == Roles.Majstor)
            {
                var filter = Builders<Majstor>.Filter.Eq(m => m.Id, prijava.IzvodjacId);
                var update = Builders<Majstor>.Update
                    .Pull(m => m.OglasiId, prijava.OglasId)
                    .Pull(m => m.PrijaveNaPosao, prijava.Id);
                await _majstori.UpdateOneAsync(filter, update);
            }
            else if (prijava.TipIzvodjaca == Roles.Firma)
            {
                var filter = Builders<Firma>.Filter.Eq(f => f.Id, prijava.IzvodjacId);
                var update = Builders<Firma>.Update
                    .Pull(f => f.PrijaveNaPosao, prijava.Id)
                    .Pull(f => f.OglasiId, prijava.OglasId);
                await _firme.UpdateOneAsync(filter, update);
            }
            else
                throw new NotSupportedException("Prosledjen tip nije majstor ili firma");
        }
    }
}
