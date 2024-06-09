namespace MajstorHUB.Services.MajstorService;

public class MajstorService : IMajstorService
{
    private readonly IMongoCollection<Majstor> _majstori;
    private readonly ProjectionDefinition<Majstor, GetMajstorResponse> _getProjection;

    public MajstorService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _majstori = db.GetCollection<Majstor>(settings.MajstoriCollectionName);

        _getProjection = Builders<Majstor>.Projection.Expression(x => new GetMajstorResponse
        {
            Adresa = x.Adresa,
            BrojTelefona = x.BrojTelefona,
            DatumKreiranjaNaloga = x.DatumKreiranjaNaloga,
            Email = x.Email,
            Id = x.Id,
            NovacNaSajtu = x.NovacNaSajtu,
            Opis = x.Opis,
            Slika = x.Slika,
            JMBG = x.JMBG,
            Ime = x.Ime,
            Prezime = x.Prezime,
            CenaPoSatu = x.CenaPoSatu,
            DatumRodjenja = x.DatumRodjenja,
            Iskustvo = x.Iskustvo,
            Struka = x.Struka,
            Zaradjeno = x.Zaradjeno,
            Oglasi = x.OglasiId,
            Blocked = x.Blocked,
            Private = x.Private
        });
    }

    public async Task<List<Majstor>> GetAll()
    {
        return await _majstori.Find(majstor => true).ToListAsync();
    }

    public async Task<Majstor> GetById(string id)
    {
        return await _majstori.Find(majstor => majstor.Id == id).FirstOrDefaultAsync();
    }

    public async Task<GetMajstorResponse> GetByIdDto(string id)
    {
        return await _majstori.Find(majstor => majstor.Id == id).Project(_getProjection).FirstOrDefaultAsync();
    }

    public async Task<Majstor> GetByJmbg(string jmbg)
    {
        return await _majstori.Find(majstor => majstor.JMBG == jmbg).FirstOrDefaultAsync();
    }

    public async Task<Majstor> GetByEmail(string email)
    {
        return await _majstori.Find(majstor => majstor.Email == email).FirstOrDefaultAsync();
    }

    public async Task Create(Majstor majstor)
    {
        await _majstori.InsertOneAsync(majstor);
    }

    public async Task Update(string id, Majstor majstor)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Set("email", majstor.Email)
            .Set("adresa", majstor.Adresa)
            .Set("broj_telefona", majstor.BrojTelefona)
            .Set("ime", majstor.Ime)
            .Set("prezime", majstor.Prezime)
            .Set("datum_rodjenja", majstor.DatumRodjenja)
            .Set("struka", majstor.Struka)
            .Set("iskustvo", majstor.Iskustvo)
            .Set("cena_po_satu", majstor.CenaPoSatu)
            .Set("oglasi", majstor.OglasiId);
        await _majstori.UpdateOneAsync(filter, update);
    }

    public async Task UpdateSelf(string id, MajstorUpdateSelf majstor)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Set("email", majstor.Email)
            .Set("slika", majstor.Slika)
            .Set("adresa", majstor.Adresa)
            .Set("broj_telefona", majstor.BrojTelefona)
            .Set("opis", majstor.Opis)
            .Set("ime", majstor.Ime)
            .Set("prezime", majstor.Prezime)
            .Set("datum_rodjenja", majstor.DatumRodjenja)
            .Set("struka", majstor.Struka)
            .Set("iskustvo", majstor.Iskustvo)
            .Set("cena_po_satu", majstor.CenaPoSatu);
        await _majstori.UpdateOneAsync(filter, update);
    }

    public async Task UpdateMoney(string id, double amount)
    {
        var filter = Builders<Majstor>.Filter.Eq(x => x.Id, id);
        var update = Builders<Majstor>.Update
            .Inc(x => x.NovacNaSajtu, amount);

        await _majstori.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _majstori.DeleteOneAsync(majstor => majstor.Id == id);
    }

    public async Task UpdateRefreshToken(string id, RefreshToken token)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Set("refresh_token", token);

        await _majstori.UpdateOneAsync(filter, update);
    }

    public async Task DeleteRefreshToken(string id)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Unset("refresh_token");

        await _majstori.UpdateOneAsync(filter, update);
    }

    public delegate double Sorting(Majstor x);
    public static double GetValue(Majstor x)
    {
        return x.Zaradjeno;
    }
    public async Task<List<GetMajstorResponse>> Filter(FIlterMajstorDTO majstor)
    {
        var filterBuilder = Builders<Majstor>.Filter;
        var sortBuilder = Builders<Majstor>.Sort;

        var queryFilters = new List<FilterDefinition<Majstor>>();
        var opisFilters = new List<FilterDefinition<Majstor>>();

        if (!string.IsNullOrEmpty(majstor.Query))
        {
            var words = majstor.Query.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var word in words)
            {
                var qRegex = new BsonRegularExpression(word, "i");
                var qFilter = filterBuilder.Or(
                    filterBuilder.Regex(x => x.Ime, qRegex),
                    filterBuilder.Regex(x => x.Prezime, qRegex),
                    filterBuilder.Regex(x => x.Adresa, qRegex),
                    filterBuilder.Regex(x => x.Struka, qRegex)
                );
                queryFilters.Add(qFilter);
            }
        }
        var queryFinalFilter = queryFilters.Count > 0
            ? filterBuilder.And(queryFilters)
            : filterBuilder.Empty;


        var iskustvoFilter = majstor.Iskustva.Count > 0
            ? filterBuilder.In(x => x.Iskustvo, majstor.Iskustva)
            : filterBuilder.Empty;

        if (!string.IsNullOrEmpty(majstor.Opis))
        {
            var words = majstor.Opis.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var word in words)
            {
                var regex = new BsonRegularExpression(word, "i");

                var filter = filterBuilder.Regex(k => k.Opis, regex);

                opisFilters.Add(filter);
            }
        }
        var opisFinalFilter = opisFilters.Count > 0
            ? filterBuilder.Or(opisFilters)
            : filterBuilder.Empty;

        var cenaFilter = filterBuilder.Gte(x => x.CenaPoSatu, majstor.CenaPoSatu);
        var zaradjenoFilter = filterBuilder.Gte(x => x.Zaradjeno, majstor.Zaradjeno);

        var privateFilter = filterBuilder.And(
            filterBuilder.Eq(x => x.Private, false),
            filterBuilder.Eq(x => x.Blocked, false));

        var finalFilter = filterBuilder.And(queryFinalFilter,
                                            iskustvoFilter, 
                                            opisFinalFilter,
                                            cenaFilter,
                                            zaradjenoFilter,
                                            privateFilter);

        var sortZaradjeno = sortBuilder.Descending(x => x.Zaradjeno);

        return await _majstori.Find(finalFilter).Sort(sortZaradjeno).Project(_getProjection).ToListAsync();
    }
}

//    public async Task<List<Majstor>> Filter(string ime, string prezime, Struka struka)
//    {
//        List<Majstor> listaImena;
//        List<Majstor> listaPrezimena;
//        List<Majstor> listaStruka;

//        if (ime == "")
//        {
//            listaImena = await _majstori.Find(_ => true).ToListAsync();
//        }
//        else
//        {
//            listaImena = await _majstori.Find(majstor => majstor.Ime.Contains(ime)).ToListAsync();
//        }
//        if (prezime == "")
//        {
//            listaPrezimena = await _majstori.Find(_ => true).ToListAsync();
//        }
//        else
//        {
//            listaPrezimena = await _majstori.Find(majstor => majstor.Prezime.Contains(prezime)).ToListAsync();
//        }
//        if (struka == Struka.Nedefinisano)
//        {
//            listaStruka= await _majstori.Find(_ => true).ToListAsync();
//        }
//        else
//        {
//            listaStruka = await _majstori.Find(majstor => majstor.Struka == struka).ToListAsync();
//        }
//        List<Majstor> konacnaLista = listaImena.Intersect(listaPrezimena, new MajstorComparer()).ToList();
//        konacnaLista = konacnaLista.Intersect(listaImena, new MajstorComparer()).ToList();
//        return konacnaLista;
//    }