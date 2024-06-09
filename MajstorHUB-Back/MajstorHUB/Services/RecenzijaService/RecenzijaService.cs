namespace MajstorHUB.Services.RecenzijaService;

public class RecenzijaService : IRecenzijaService
{
    private readonly IMongoCollection<RecenzijaOld> _recenzije;

    public RecenzijaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _recenzije = db.GetCollection<RecenzijaOld>(settings.RecenzijeCollectionName);
    }

    public async Task<List<RecenzijaOld>> GetAll()
    {
        return await _recenzije.Find(recenzija => true).ToListAsync();
    }

    public async Task<RecenzijaOld> GetById(string id)
    {
        return await _recenzije.Find(recenzija => recenzija.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<RecenzijaOld>> GetByRecenzent(string recenzent)
    {
        return await _recenzije.Find(recenzija => recenzija.Recenzent == recenzent).ToListAsync();
    }
    public async Task<List<RecenzijaOld>> GetByRecenzirani(string recenzirani)
    {
        return await _recenzije.Find(recenzija => recenzija.Recenzirani == recenzirani).ToListAsync();
    }

    public async Task Create(RecenzijaOld recenzija)
    {
        await _recenzije.InsertOneAsync(recenzija);
    }

    public async Task Update(string id, RecenzijaOld recenzija)
    {
        var filter = Builders<RecenzijaOld>.Filter.Eq(recenzija => recenzija.Id, id);
        var update = Builders<RecenzijaOld>.Update
                    .Set("ocena", recenzija.Ocena)
                    .Set("opis", recenzija.Opis);
        await _recenzije.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _recenzije.DeleteOneAsync(recenzija => recenzija.Id == id);
    }
}
