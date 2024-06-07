namespace MajstorHUB.Services.KorisnikService;

public class KorisnikService : IKorisnikService
{
    private readonly IMongoCollection<Korisnik> _korisnici;
    private readonly ProjectionDefinition<Korisnik, GetKorisnikResponse> _getProjection;

    public KorisnikService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _korisnici = db.GetCollection<Korisnik>(settings.KorisniciCollectionName);

        _getProjection = Builders<Korisnik>.Projection.Expression(x => new GetKorisnikResponse
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
            DatumRodjenja = x.DatumRodjenja,
            Ime = x.Ime,
            Prezime = x.Prezime,
            Potroseno = x.Potroseno,
            Oglasi = x.OglasiId
        });
    }

    public async Task<List<Korisnik>> GetAll()
    {
        return await _korisnici.Find(korisnik => true).ToListAsync();
    }

    public async Task<Korisnik> GetById(string id)
    {
        return await _korisnici.Find(korisnik => korisnik.Id == id).FirstOrDefaultAsync();
    }

    public async Task<GetKorisnikResponse> GetByIdDto(string id)
    {
        return await _korisnici.Find(korisnik => korisnik.Id == id).Project(_getProjection).FirstOrDefaultAsync();
    }

    public async Task<Korisnik> GetByJmbg(string jmbg)
    {
        return await _korisnici.Find(korisnik => korisnik.JMBG == jmbg).FirstOrDefaultAsync();
    }

    public async Task<Korisnik> GetByEmail(string email)
    {
        return await _korisnici.Find(korisnik => korisnik.Email == email).FirstOrDefaultAsync();
    }

    public async Task Create(Korisnik korisnik)
    {
        await _korisnici.InsertOneAsync(korisnik);
    }

    public async Task Update(string id, Korisnik korisnik)
    {
        var filter = Builders<Korisnik>.Filter.Eq(korisnik => korisnik.Id, id);
        var update = Builders<Korisnik>.Update
            .Set("slika", korisnik.Slika)
            .Set("email", korisnik.Email)
            .Set("adresa", korisnik.Adresa)
            .Set("broj_telefona", korisnik.BrojTelefona)
            .Set("ime", korisnik.Ime)
            .Set("prezime", korisnik.Prezime)
            .Set("datum_rodjenja", korisnik.DatumRodjenja)
            .Set("oglasi", korisnik.OglasiId);
        await _korisnici.UpdateOneAsync(filter, update);
    }

    public async Task UpdateSelf(string id, KorisnikUpdateSelf korisnik)
    {
        var filter = Builders<Korisnik>.Filter.Eq(korisnik => korisnik.Id, id);
        var update = Builders<Korisnik>.Update
            .Set("email", korisnik.Email)
            .Set("slika", korisnik.Slika)
            .Set("adresa", korisnik.Adresa)
            .Set("broj_telefona", korisnik.BrojTelefona)
            .Set("opis", korisnik.Opis)
            .Set("ime", korisnik.Ime)
            .Set("prezime", korisnik.Prezime)
            .Set("datum_rodjenja", korisnik.DatumRodjenja);
        await _korisnici.UpdateOneAsync(filter, update);
    }

    public async Task UpdateMoney(string id, double amount)
    {
        var filter = Builders<Korisnik>.Filter.Eq(x => x.Id, id);
        var update = Builders<Korisnik>.Update
            .Inc(x => x.NovacNaSajtu, amount);

        await _korisnici.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _korisnici.DeleteOneAsync(korisnik => korisnik.Id == id);
    }

    public async Task UpdateRefreshToken(string id, RefreshToken token)
    {
        var filter = Builders<Korisnik>.Filter.Eq(korisnik => korisnik.Id, id);
        var update = Builders<Korisnik>.Update
            .Set("refresh_token", token);

        await _korisnici.UpdateOneAsync(filter, update);
    }

    public async Task DeleteRefreshToken(string id)
    {
        var filter = Builders<Korisnik>.Filter.Eq(k => k.Id, id);
        var update = Builders<Korisnik>.Update
            .Unset("refresh_token");

        await _korisnici.UpdateOneAsync(filter, update);
    }

    public async Task<List<GetKorisnikResponse>> Filter(FilterKorisnikDto korisnik)
    {
        var filterBuilder = Builders<Korisnik>.Filter;

        var queryFilters = new List<FilterDefinition<Korisnik>>();
        var opisFilters = new List<FilterDefinition<Korisnik>>();

        if (!string.IsNullOrEmpty(korisnik.Query))
        {
            var words = korisnik.Query.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var word in words)
            {
                var regex = new BsonRegularExpression(word, "i");

                var partFilter = filterBuilder.Or(
                    filterBuilder.Regex(k => k.Ime, regex),
                    filterBuilder.Regex(k => k.Prezime, regex),
                    filterBuilder.Regex(k => k.Adresa, regex)
                );

                queryFilters.Add(partFilter);
            }
        }

        var queryFinalFilter = queryFilters.Count > 0
            ? filterBuilder.And(queryFilters)
            : filterBuilder.Empty;

        if (!string.IsNullOrEmpty(korisnik.Opis))
        {
            var words = korisnik.Opis.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

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

        var zaradjenoFilter = korisnik.Potroseno > -1
            ? filterBuilder.Gte(x => x.Potroseno, korisnik.Potroseno)
            : filterBuilder.Eq(x => x.Potroseno, 0);

        var finalFilter = filterBuilder.And(queryFinalFilter, opisFinalFilter, zaradjenoFilter);

        var sortBuilder = Builders<Korisnik>.Sort;
        var potroseno = sortBuilder.Descending(x => x.Potroseno);

        return await _korisnici.Find(finalFilter).Sort(potroseno).Project(_getProjection).ToListAsync();
    }

    //public async Task<List<Korisnik>> Filter(string ime, string prezime)
    //{
    //    //Ako je string prazan vrati sve
    //    List<Korisnik> listaImena;
    //    List<Korisnik> listaPrezimena;

    //    if (ime == "")
    //    {
    //        listaImena = await _korisnici.Find(korisnik => true).ToListAsync();
    //    }
    //    else
    //    {
    //        listaImena = await _korisnici.Find(korisnik => korisnik.Ime.Contains(ime)).ToListAsync();
    //    }
    //    if (prezime == "")
    //    {
    //        listaPrezimena = await _korisnici.Find(korisnik => true).ToListAsync();
    //    }
    //    else
    //    {
    //        listaPrezimena = await _korisnici.Find(korisnik => korisnik.Prezime.Contains(prezime)).ToListAsync();
    //    }

    //    List<Korisnik> konacnaLista = listaImena.Intersect(listaPrezimena, new KorisnikComparer()).ToList();
    //    return konacnaLista;
    //}
}
