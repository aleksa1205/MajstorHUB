namespace MajstorHUB.Services.FirmaService;

public class FirmaService : IFirmaService
{
    private readonly IMongoCollection<Firma> _firme;
    private readonly ProjectionDefinition<Firma, GetFirmaResponse> _getProjection;

    public FirmaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);

        _getProjection = Builders<Firma>.Projection.Expression(f => new GetFirmaResponse
        {
            Adresa = f.Adresa,
            BrojTelefona = f.BrojTelefona,
            DatumKreiranjaNaloga = f.DatumKreiranjaNaloga,
            Email = f.Email,
            Id = f.Id,
            NovacNaSajtu = f.NovacNaSajtu,
            Opis = f.Opis,
            Slika = f.Slika,
            Naziv = f.Naziv,
            PIB = f.PIB,
            CenaPoSatu = f.CenaPoSatu,
            Iskustvo = f.Iskustvo,
            Struke = f.Struke,
            Zaradjeno = f.Zaradjeno,
            Oglasi = f.OglasiId,
            Private = f.Private,
            Blocked = f.Blocked
        });
    }

    public async Task<List<Firma>> GetAll()
    {
        return await _firme.Find(firma => true).ToListAsync();
    }

    public async Task<Firma> GetById(string id)
    {
        return await _firme.Find(firma => firma.Id == id).FirstOrDefaultAsync();
    }

    public async Task<GetFirmaResponse> GetByIdDto(string id)
    {
        return await _firme.Find(firma => firma.Id == id).Project(_getProjection).FirstOrDefaultAsync();
    }

    public async Task<Firma> GetByEmail(string email)
    {
        return await _firme.Find(firma => firma.Email == email).FirstOrDefaultAsync();
    }

    public async Task<Firma> GetByPib(string pib)
    {
        return await _firme.Find(firma => firma.PIB == pib).FirstOrDefaultAsync();
    }

    //Task<Firma> zamenjeno sa Task
    public async Task Create(Firma firma)
    {
        await _firme.InsertOneAsync(firma);
    }

    public async Task Update(string id, Firma firma)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Set("email", firma.Email)
            .Set("adresa", firma.Adresa)
            .Set("broj_telefona", firma.BrojTelefona)
            .Set("naziv", firma.Naziv)
            .Set("struke", firma.Struke)
            .Set("oglasi", firma.OglasiId);
        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task UpdateSelf(string id, FirmaUpdateSelf firma)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Set("email", firma.Email)
            .Set("slika", firma.Slika)
            .Set("adresa", firma.Adresa)
            .Set("broj_telefona", firma.BrojTelefona)
            .Set("opis", firma.Opis)
            .Set("naziv", firma.Naziv)
            .Set("struke", firma.Struke)
            .Set("iskustvo", firma.Iskustvo)
            .Set("cena_po_satu", firma.CenaPoSatu);
        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _firme.DeleteOneAsync(firma => firma.Id == id);
    }

    public async Task UpdateRefreshToken(string id, RefreshToken token)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Set("refresh_token", token);

        await _firme.UpdateOneAsync(filter, update);
    }
   public async Task UpdateMoney(string id, double amount)
    {
        var filter = Builders<Firma>.Filter.Eq(x => x.Id, id);
        var update = Builders<Firma>.Update
            .Inc(x => x.NovacNaSajtu, amount);

        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task DeleteRefreshToken(string id)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Unset("refresh_token");

        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task<List<GetFirmaResponse>> Filter(FilterFirmaDTO firma)
    {
        var filterBuilder = Builders<Firma>.Filter;
        var sortBuilder = Builders<Firma>.Sort;

        var queryFilters = new List<FilterDefinition<Firma>>();
        var opisFilters = new List<FilterDefinition<Firma>>();

        if (!string.IsNullOrEmpty(firma.Query))
        {
            var words = firma.Query.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);


            foreach (var word in words)
            {
                var qRegex = new BsonRegularExpression(word, "i");
                var qFilter = filterBuilder.Or(
                    filterBuilder.Regex(x => x.Naziv, qRegex),
                    filterBuilder.Regex(x => x.Adresa, qRegex),
                    filterBuilder.Regex(x => x.Struke, qRegex)
                );
                queryFilters.Add(qFilter);
            }
        }
        var queryFinalFilter = queryFilters.Count > 0
            ? filterBuilder.And(queryFilters)
            : filterBuilder.Empty;


        var iskustvoFilter = firma.Iskustva.Count > 0
            ? filterBuilder.In(x => x.Iskustvo, firma.Iskustva)
            : filterBuilder.Empty;

        if (!string.IsNullOrEmpty(firma.Opis))
        {
            var words = firma.Opis.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

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

        var cenaFilter = filterBuilder.Gte(x => x.CenaPoSatu, firma.CenaPoSatu);
        var zaradjenoFilter = filterBuilder.Gte(x => x.Zaradjeno, firma.Zaradjeno);

        var privateFilter = filterBuilder.And(
            filterBuilder.Eq(x => x.Private, false),
            filterBuilder.Eq(x => x.Blocked, false));

        var finalFilter = filterBuilder.And(queryFinalFilter,
                                            opisFinalFilter,
                                            iskustvoFilter,
                                            cenaFilter,
                                            zaradjenoFilter,
                                            privateFilter);

        var sortZaradjeno = sortBuilder.Descending(x => x.Zaradjeno);

        return await _firme.Find(finalFilter).Sort(sortZaradjeno).Project(_getProjection).ToListAsync();
    }

    //public async Task<List<Firma>> Filter(string naziv, Struka struka)
    //{
    //    List<Firma> listaNaziva;
    //    List<Firma> listaStruka;

    //    if (naziv == "")
    //    {
    //        listaNaziva = await _firme.Find(_ => true).ToListAsync();
    //    }
    //    else
    //    {
    //        listaNaziva = await _firme.Find(firma => firma.Naziv.Contains(naziv)).ToListAsync();
    //    }
    //    if (struka == Struka.Nedefinisano)
    //    {
    //        listaStruka=await _firme.Find(_=>true).ToListAsync();
    //    }
    //    else
    //    {
    //        listaStruka = await _firme.Find(firma => firma.Struke.Contains(struka)).ToListAsync();
    //    }

    //    List<Firma> konacnaLista = listaNaziva.Intersect(listaStruka, new FirmaComparer()).ToList();
    //    return konacnaLista;
    //}
}
