
using MajstorHUB.Models;

namespace MajstorHUB.Services.KorisnikService;

public class KorisnikService : IKorisnikService
{
    private readonly IMongoCollection<Korisnik> _korisnici;

    public KorisnikService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _korisnici = db.GetCollection<Korisnik>(settings.KorisniciCollectionName);
    }

    public async Task<List<Korisnik>> GetAll()
    {
        return await _korisnici.Find(korisnik => true).ToListAsync();
    }

    public async Task<Korisnik> GetById(string id)
    {
        return await _korisnici.Find(korisnik => korisnik.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Korisnik> GetByJmbg(string jmbg)
    {
        return await _korisnici.Find(korisnik => korisnik.JMBG == jmbg).FirstOrDefaultAsync();
    }

    public async Task<Korisnik> GetByEmail(string email)
    {
        return await _korisnici.Find(korisnik => korisnik.Email == email).FirstOrDefaultAsync();
    }

    public async Task Create(Korisnik korisnik)
    {
        await _korisnici.InsertOneAsync(korisnik);
    }

    public async Task Update(string id, Korisnik korisnik)
    {
        var filter = Builders<Korisnik>.Filter.Eq(korisnik => korisnik.Id, id);
        var update = Builders<Korisnik>.Update
            .Set("email", korisnik.Email)
            .Set("adresa", korisnik.Adresa)
            .Set("broj_telefona", korisnik.BrojTelefona)
            .Set("ime", korisnik.Ime)
            .Set("prezime", korisnik.Prezime)
            .Set("datum_rodjenja", korisnik.DatumRodjenja);
        await _korisnici.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _korisnici.DeleteOneAsync(korisnik => korisnik.Id == id);
    }

    public async Task UpdateRefreshToken(string id, RefreshToken token)
    {
        var filter = Builders<Korisnik>.Filter.Eq(korisnik => korisnik.Id, id);
        var update = Builders<Korisnik>.Update
            .Set("refresh_token", token);

        await _korisnici.UpdateOneAsync(filter, update);
    }

    public async Task DeleteRefreshToken(string id)
    {
        var filter = Builders<Korisnik>.Filter.Eq(k => k.Id, id);
        var update = Builders<Korisnik>.Update
            .Unset("refresh_token");

        await _korisnici.UpdateOneAsync(filter, update);
    }
}
