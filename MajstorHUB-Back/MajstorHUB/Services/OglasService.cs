namespace MajstorHUB.Services;

public class OglasService : IOglasService
{
    private readonly IMongoCollection<Oglas> _oglasi;
    
    public OglasService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db=mongoClient.GetDatabase(settings.DatabaseName);
        _oglasi = db.GetCollection<Oglas>(settings.OglasiCollectionName);
    }

    public async Task<List<Oglas>> GetAll()
    {
        return await _oglasi.Find(oglas => true).ToListAsync();
    }

    public async Task<Oglas> GetById(string id)
    {
        return await _oglasi.Find(oglas => oglas.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<Oglas>> GetByKorisnik(string korisnikId)
    {
        return await _oglasi.Find(oglasi=>oglasi.KorisnikId==korisnikId).ToListAsync();
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

    public async Task Delete(string id)
    {
        await _oglasi.DeleteOneAsync(oglas => oglas.Id == id);
    }
}