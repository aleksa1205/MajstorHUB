namespace MajstorHUB.Services.PrijavaService;

public class PrijavaService : IPrijavaService
{
    private readonly IMongoCollection<Prijava> _prijave;
    private readonly IMongoCollection<Oglas> _oglasi;
    private readonly IMongoCollection<Majstor> _majstori;
    private readonly IMongoCollection<Firma> _firme;

    public PrijavaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _prijave = db.GetCollection<Prijava>(settings.PrijaveCollectionName);
        _oglasi = db.GetCollection<Oglas>(settings.OglasiCollectionName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);
        _majstori = db.GetCollection<Majstor>(settings.MajstoriCollectionName);
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
        return await _prijave.Find(prijava => prijava.OglasId == oglasId).ToListAsync();
    }

    public async Task Create(Prijava prijava)
    {
        await _prijave.InsertOneAsync(prijava);

        var oglasFilter = Builders<Oglas>.Filter.Eq(x => x.Id, prijava.OglasId);
        var updateOglas = Builders<Oglas>.Update.Push(o => o.PrijaveIds, prijava.Id);
        await _oglasi.UpdateOneAsync(oglasFilter, updateOglas);

        if (prijava.TipIzvodjaca == Roles.Majstor)
        {
            var filter = Builders<Majstor>.Filter.Eq(m => m.Id, prijava.IzvodjacId);
            var update = Builders<Majstor>.Update.Push(m => m.OglasiId, prijava.OglasId);
            await _majstori.UpdateOneAsync(filter, update);
        }
        else if (prijava.TipIzvodjaca == Roles.Firma)
        {
            var filter = Builders<Firma>.Filter.Eq(f => f.Id, prijava.IzvodjacId);
            var update = Builders<Firma>.Update.Push(f => f.OglasiId, prijava.OglasId);
            await _firme.UpdateOneAsync(filter, update);
        }
        else
            throw new NotSupportedException("Prosledjen tip nije majstor ili firma");
    }

    public async Task Delete(string id)
    {
        var prijava = await _prijave.FindOneAndDeleteAsync(prijava => prijava.Id == id);
        if(prijava is not null)
        {
            var oglasFilter = Builders<Oglas>.Filter.Eq(x => x.Id, prijava.OglasId);
            var updateOglas = Builders<Oglas>.Update.Pull(o => o.PrijaveIds, prijava.Id);
            await _oglasi.UpdateOneAsync(oglasFilter, updateOglas);

            if (prijava.TipIzvodjaca == Roles.Majstor)
            {
                var filter = Builders<Majstor>.Filter.Eq(m => m.Id, prijava.IzvodjacId);
                var update = Builders<Majstor>.Update.Pull(m => m.OglasiId, prijava.OglasId);
                await _majstori.UpdateOneAsync(filter, update);
            }
            else if (prijava.TipIzvodjaca == Roles.Firma)
            {
                var filter = Builders<Firma>.Filter.Eq(f => f.Id, prijava.IzvodjacId);
                var update = Builders<Firma>.Update.Pull(f => f.OglasiId, prijava.OglasId);
                await _firme.UpdateOneAsync(filter, update);
            }
            else
                throw new NotSupportedException("Prosledjen tip nije majstor ili firma");
        }
    }
}
