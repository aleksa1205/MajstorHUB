namespace MajstorHUB.Services.OglasService;

public class OglasService : IOglasService
{
    private readonly IMongoCollection<Oglas> _oglasi;
    private readonly IMongoCollection<Korisnik> _korisnici;
    private readonly ProjectionDefinition<Oglas, GetOglasDTO> _getProjection;

    public OglasService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _oglasi = db.GetCollection<Oglas>(settings.OglasiCollectionName);
        _korisnici = db.GetCollection<Korisnik>(settings.KorisniciCollectionName);

        //_getProjection = Builders<Oglas>.Projection.Expression(o => new GetOglasDTO
        //{
        //    Cena = o.Cena,
        //    DatumKreiranja = o.DatumKreiranja,
        //    KorisnikId = o.KorisnikId,
        //    Naslov = o.Naslov,
        //    Opis = o.Opis,
        //    DuzinaPosla = o.DuzinaPosla,
        //    Id = o.Id,
        //    Iskustvo = o.Iskustvo,
        //    Lokacija = o.Lokacija,
        //    Struke = o.Struke
        //});
    }

    // Imitacija projekcije kao u mongoDB driver-u, samo za obican .net linq
    public static GetOglasDTO ProjectToGetDto(Oglas oglas, Korisnik korisnik)
    {
        return new GetOglasDTO
        {
            Cena = oglas.Cena,
            DatumKreiranja = oglas.DatumKreiranja,
            DuzinaPosla = oglas.DuzinaPosla,
            Id = oglas.Id,
            Iskustvo = oglas.Iskustvo,
            Lokacija = oglas.Lokacija,
            Naslov = oglas.Naslov,
            Struke = oglas.Struke,
            Opis = oglas.Opis,
            Ime = korisnik.Ime!,
            Prezime = korisnik.Prezime!,
            KorisnikId = oglas.KorisnikId,
            Potroseno = korisnik.Potroseno
        };
    }

    public async Task<List<Oglas>> GetAll()
    {
        return await _oglasi.Find(oglas => true).ToListAsync();
    }

    public async Task<Oglas> GetById(string id)
    {
        return await _oglasi.Find(oglas => oglas.Id == id).FirstOrDefaultAsync();
    }

    public async Task<GetOglasDTO> GetByIdDto(string id)
    {
        var oglas = await _oglasi.Find(oglas => oglas.Id == id).FirstOrDefaultAsync();
        if (oglas is null)
            return null;
        var korisnik = await _korisnici.Find(k => k.Id == oglas.KorisnikId).FirstOrDefaultAsync();

        return ProjectToGetDto(oglas, korisnik);
    }

    public async Task<List<Oglas>> GetByKorisnik(string korisnikId)
    {
        return await _oglasi.Find(oglasi => oglasi.KorisnikId == korisnikId).ToListAsync();
    }

    public async Task Create(Oglas oglas)
    {
        await _oglasi.InsertOneAsync(oglas);
    }

    public async Task Update(string id, Oglas oglas)
    {
        var filter = Builders<Oglas>.Filter.Eq(oglas => oglas.Id, id);
        var update = Builders<Oglas>.Update
            .Set("naslov", oglas.Naslov)
            .Set("opis", oglas.Opis);
        await _oglasi.UpdateOneAsync(filter, update);
    }

    public async Task UpdateSelf(OglasUpdateSelf oglas)
    {
        var filter = Builders<Oglas>.Filter.Eq(og => og.Id, oglas.Id);
        var update = Builders<Oglas>.Update
            .Set("naslov", oglas.Naslov)
            .Set("iskustvo", oglas.Iskustvo)
            .Set("struke", oglas.Struke)
            .Set("opis", oglas.Opis)
            .Set("cena", oglas.Cena)
            .Set("duzina_posla", oglas.DuzinaPosla)
            .Set("lokacija", oglas.Lokacija);
        await _oglasi.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _oglasi.DeleteOneAsync(oglas => oglas.Id == id);
    }

    public async Task<List<GetOglasDTO>> Filter(FilterOglasDTO oglas)
    {
        var filterBuilder = Builders<Oglas>.Filter;

        var queryFilters = new List<FilterDefinition<Oglas>>();
        var opisFilters = new List<FilterDefinition<Oglas>>();

        if(!string.IsNullOrEmpty(oglas.Query))
        {
            var words = oglas.Query.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            foreach(var word in words)
            {
                var regex = new BsonRegularExpression(word, "i");

                var partFilter = filterBuilder.Or(
                    filterBuilder.Regex(x => x.Naslov, regex),
                    filterBuilder.Regex(x => x.Struke, regex),
                    filterBuilder.Regex(x => x.Lokacija, regex)
                );
                queryFilters.Add(partFilter);
            }
        }
        var queryFinalFilter = queryFilters.Count > 0
            ? filterBuilder.And(queryFilters)
            : filterBuilder.Empty;

        if(!string.IsNullOrEmpty(oglas.Opis))
        {
            var words = oglas.Opis.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            
            foreach (var word in words)
            {
                var regex = new BsonRegularExpression(word, "i");

                var filter = filterBuilder.Regex(x => x.Opis, regex);

                opisFilters.Add(filter);
            }
        }
        var opisFinalFilter = opisFilters.Count > 0
            ? filterBuilder.Or(opisFilters)
            : filterBuilder.Empty;

        var iskustvoFilter = oglas.Iskustva.Count > 0
            ? filterBuilder.In(x => x.Iskustvo, oglas.Iskustva)
            : filterBuilder.Empty;

        var duzinaFilter = oglas.DuzinePosla.Count > 0
            ? filterBuilder.In(x => x.DuzinaPosla, oglas.DuzinePosla)
            : filterBuilder.Empty;

        var cenaFilter = filterBuilder.And(
            filterBuilder.Gte(x => x.Cena, oglas.Cena.Od),
            filterBuilder.Lte(x => x.Cena, oglas.Cena.Do)
            );

        var finalFilter = filterBuilder.And(queryFinalFilter,
                                            opisFinalFilter,
                                            iskustvoFilter,
                                            duzinaFilter,
                                            cenaFilter
                                            );

        var sortBuilder = Builders<Oglas>.Sort;
        var datumKreiranja = sortBuilder.Descending(x => x.DatumKreiranja);

        var oglasi = await _oglasi.Find(finalFilter).Sort(datumKreiranja).ToListAsync();

        var korisnikIds = oglasi.Select(o => o.KorisnikId).Distinct().ToList();

        var korisnikFilterBuilder = Builders<Korisnik>.Filter;

        var zaradjenoFilter = oglas.Potroseno > -1
            ? korisnikFilterBuilder.Gte(x => x.Potroseno, oglas.Potroseno)
            : korisnikFilterBuilder.Eq(x => x.Potroseno, 0);

        var korisniciFilter = zaradjenoFilter &
                              korisnikFilterBuilder.In(x => x.Id, korisnikIds);
                            
        var korisnici = await _korisnici.Find(korisniciFilter).ToListAsync();

        var result = oglasi
            .Join(korisnici,
                  oglas => oglas.KorisnikId,
                  korisnik => korisnik.Id,
                  ProjectToGetDto)
            .ToList();

        return result;
    }
}