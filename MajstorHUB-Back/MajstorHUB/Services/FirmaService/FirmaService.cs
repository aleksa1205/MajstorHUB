using MajstorHUB.Utility;
namespace MajstorHUB.Services.FirmaService;

public class FirmaService : IFirmaService
{
    private readonly IMongoCollection<Firma> _firme;

    public FirmaService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);
    }

    public async Task<List<Firma>> GetAll()
    {
        return await _firme.Find(firma => true).ToListAsync();

    }

    public async Task<Firma> GetById(string id)
    {
        return await _firme.Find(firma => firma.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Firma> GetByEmail(string email)
    {
        return await _firme.Find(firma => firma.Email == email).FirstOrDefaultAsync();
    }

    public async Task<Firma> GetByPib(string pib)
    {
        return await _firme.Find(firma => firma.PIB == pib).FirstOrDefaultAsync();
    }

    //Task<Firma> zamenjeno sa Task
    public async Task Create(Firma firma)
    {
        await _firme.InsertOneAsync(firma);
    }

    public async Task Update(string id, Firma firma)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Set("email", firma.Email)
            .Set("adresa", firma.Adresa)
            .Set("broj_telefona", firma.BrojTelefona)
            .Set("naziv", firma.Naziv)
            .Set("struke", firma.Struke);
        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task UpdateSelf(string id, FirmaUpdateSelf firma)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Set("email", firma.Email)
            .Set("slika", firma.Slika)
            .Set("adresa", firma.Adresa)
            .Set("broj_telefona", firma.BrojTelefona)
            .Set("opis", firma.Opis)
            .Set("naziv", firma.Naziv)
            .Set("struke", firma.Struke)
            .Set("iskustvo", firma.Iskustvo)
            .Set("cena_po_satu", firma.CenaPoSatu);
        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _firme.DeleteOneAsync(firma => firma.Id == id);
    }

    public async Task UpdateRefreshToken(string id, RefreshToken token)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Set("refresh_token", token);

        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task DeleteRefreshToken(string id)
    {
        var filter = Builders<Firma>.Filter.Eq(firma => firma.Id, id);
        var update = Builders<Firma>.Update
            .Unset("refresh_token");

        await _firme.UpdateOneAsync(filter, update);
    }

    public async Task<List<Firma>> Filter(string naziv, Struka struka)
    {
        List<Firma> listaNaziva;
        List<Firma> listaStruka;

        if (naziv == "")
        {
            listaNaziva = await _firme.Find(_ => true).ToListAsync();
        }
        else
        {
            listaNaziva = await _firme.Find(firma => firma.Naziv.Contains(naziv)).ToListAsync();
        }
        if (struka == Struka.Nedefinisano)
        {
            listaStruka=await _firme.Find(_=>true).ToListAsync();
        }
        else
        {
            listaStruka = await _firme.Find(firma => firma.Struke.Contains(struka)).ToListAsync();
        }

        List<Firma> konacnaLista = listaNaziva.Intersect(listaStruka, new FirmaComparer()).ToList();
        return konacnaLista;
    }
}
