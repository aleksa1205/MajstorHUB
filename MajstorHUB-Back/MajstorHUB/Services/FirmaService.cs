
namespace MajstorHUB.Services;

public class FirmaService : IFirmaService
{
    private readonly IMongoCollection<Firma> _firme;

    public FirmaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);
    }

    public async Task<Firma> Get(string id)
    {
        return await _firme.Find(firma => firma.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Firma> GetByPib(string pib)
    {
        return await _firme.Find(firma => firma.PIB == pib).FirstOrDefaultAsync();
    }

    public async Task<List<Firma>> GetAll()
    {
        return await _firme.Find(firma => true).ToListAsync();
    }

    public async Task<Firma> Create(Firma firma)
    {
        await _firme.InsertOneAsync(firma);
        return firma;
    }

    public async void Update(string id, Firma firma)
    {
        await _firme.ReplaceOneAsync(firma => firma.Id == id, firma);
        return;
    }

    public async void Delete(string id)
    {
        await _firme.DeleteOneAsync(firma => firma.Id == id);
        return;
    }
}
