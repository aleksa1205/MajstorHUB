using MajstorHUB.Utility;
namespace MajstorHUB.Services.MajstorService;

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

    public async Task UpdateSelf(string id, MajstorUpdateSelf majstor)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Set("email", majstor.Email)
            .Set("slika", majstor.Slika)
            .Set("adresa", majstor.Adresa)
            .Set("broj_telefona", majstor.BrojTelefona)
            .Set("opis", majstor.Opis)
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

    public async Task UpdateRefreshToken(string id, RefreshToken token)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Set("refresh_token", token);

        await _majstori.UpdateOneAsync(filter, update);
    }

    public async Task DeleteRefreshToken(string id)
    {
        var filter = Builders<Majstor>.Filter.Eq(majstor => majstor.Id, id);
        var update = Builders<Majstor>.Update
            .Unset("refresh_token");

        await _majstori.UpdateOneAsync(filter, update);
    }

    public async Task<List<Majstor>> Filter(string ime, string prezime, Struka struka)
    {
        List<Majstor> listaImena;
        List<Majstor> listaPrezimena;
        List<Majstor> listaStruka;

        if (ime == "")
        {
            listaImena = await _majstori.Find(_ => true).ToListAsync();
        }
        else
        {
            listaImena = await _majstori.Find(majstor => majstor.Ime.Contains(ime)).ToListAsync();
        }
        if (prezime == "")
        {
            listaPrezimena = await _majstori.Find(_ => true).ToListAsync();
        }
        else
        {
            listaPrezimena = await _majstori.Find(majstor => majstor.Prezime.Contains(prezime)).ToListAsync();
        }
        if (struka == Struka.Nedefinisano)
        {
            listaStruka= await _majstori.Find(_ => true).ToListAsync();
        }
        else
        {
            listaStruka = await _majstori.Find(majstor => majstor.Struka == struka).ToListAsync();
        }
        List<Majstor> konacnaLista = listaImena.Intersect(listaPrezimena, new MajstorComparer()).ToList();
        konacnaLista = konacnaLista.Intersect(listaImena, new MajstorComparer()).ToList();
        return konacnaLista;
    }
}