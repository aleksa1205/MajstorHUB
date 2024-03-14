namespace MajstorHUB.Services;

public class RecenzijaService
{
    private readonly IMongoCollection<Recenzija> _recenzije;

    public RecenzijaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _recenzije = db.GetCollection<Recenzija>(settings.RecenzijeCollectionName);
    }

    public async Task<List<Recenzija>> GetAll()
    {
        return await _recenzije.Find(recenzija => true).ToListAsync();
    }

    public async Task<Recenzija> GetById(string id)
    {
        return await _recenzije.Find(recenzija => recenzija.Id == id).FirstOrDefaultAsync();
    }

    public async Task Create(Recenzija recenzija)
    {
        await _recenzije.InsertOneAsync(recenzija);
    }

    public async Task Update(string id, Recenzija recenzija)
    {
        var filter = Builders<Recenzija>.Filter.Eq(recenzija => recenzija.Id, id);
        var update = Builders<Recenzija>.Update
                    .Set("ocena",recenzija.Ocena)
                    .Set("opis", recenzija.Opis);
        await _recenzije.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _recenzije.DeleteOneAsync(recenzija => recenzija.Id == id);
    }
}
