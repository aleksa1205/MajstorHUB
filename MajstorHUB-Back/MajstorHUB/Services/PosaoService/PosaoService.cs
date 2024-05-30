namespace MajstorHUB.Services.PosaoService;

public class PosaoService : IPosaoService
{
    private readonly IMongoCollection<Posao> _poslovi;

    public PosaoService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _poslovi = db.GetCollection<Posao>(settings.PosloviCollectionName);
    }

    public async Task<List<Posao>> GetAll()
    {
        return await _poslovi.Find(posao => true).ToListAsync();
    }

    public async Task<Posao> GetById(string id)
    {
        return await _poslovi.Find(posao => posao.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<Posao>> GetByKorisnik(string korisnikId)
    {
        return await _poslovi.Find(posao => posao.Korisnik == korisnikId).ToListAsync();
    }

    public async Task<List<Posao>> GetByIzvodjac(string izvodjacId)
    {
        return await _poslovi.Find(posao => posao.Izvodjac == izvodjacId).ToListAsync();
    }

    public async Task Create(Posao posao)
    {
        await _poslovi.InsertOneAsync(posao);
    }

    public async Task Delete(string id)
    {
        await _poslovi.DeleteOneAsync(posao => posao.Id == id);
    }
}
