namespace MajstorHUB.Services;

public class MajstorService : IMajstorService
{
    private readonly IMongoCollection<Majstor> _majstori;

    public MajstorService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _majstori = db.GetCollection<Majstor>(settings.MajstoriCollectionName);
    }

    public async Task<List<Majstor>> GetAll()
    {
        return await _majstori.Find(majstor => true).ToListAsync();
    }

    public async Task<Majstor> GetById(string id)
    {
        return await _majstori.Find(majstor => majstor.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Majstor> GetByJmbg(string jmbg)
    {
        return await _majstori.Find(majstor => majstor.JMBG == jmbg).FirstOrDefaultAsync();
    }

    public async Task<Majstor> GetByEmail(string email)
    {
        return await _majstori.Find(majstor => majstor.Email == email).FirstOrDefaultAsync();
    }

    public async Task Create(Majstor majstor)
    {
        await _majstori.InsertOneAsync(majstor);
    }

    public async Task Update(string id, Majstor majstor)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Set("email", majstor.Email)
            .Set("adresa", majstor.Adresa)
            .Set("broj_telefona", majstor.BrojTelefona)
            .Set("ime", majstor.Ime)
            .Set("prezime", majstor.Prezime)
            .Set("datum_rodjenja", majstor.DatumRodjenja)
            .Set("struka", majstor.Struka)
            .Set("iskustvo", majstor.Iskustvo)
            .Set("cena_po_satu", majstor.CenaPoSatu);
        await _majstori.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _majstori.DeleteOneAsync(majstor => majstor.Id == id);
    }
}