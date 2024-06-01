namespace MajstorHUB.Services.PrijavaService;

public class PrijavaService : IPrijavaService
{
    private readonly IMongoCollection<Prijava> _prijave;

    public PrijavaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _prijave = db.GetCollection<Prijava>(settings.PrijaveCollectionName);
    }

    public async Task<List<Prijava>> GetAll()
    {
        return await _prijave.Find(prijava => true).ToListAsync();
    }

    public async Task<Prijava> GetById(string id)
    {
        return await _prijave.Find(prijava => prijava.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<Prijava>> GetByOglas(string oglasId)
    {
        return await _prijave.Find(prijava => prijava.Oglas == oglasId).ToListAsync();
    }

    public async Task Create(Prijava prijava)
    {
        await _prijave.InsertOneAsync(prijava);
    }

    public async Task Delete(string id)
    {
        await _prijave.DeleteOneAsync(prijava => prijava.Id == id);
    }
}
