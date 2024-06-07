using DnsClient.Protocol;
using MajstorHUB.Models.Users;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MajstorHUB.Services.AdminService;

public class AdminService : IAdminService
{
    private readonly IMongoCollection<Korisnik> _korisnici;
    private readonly IMongoCollection<Majstor> _majstori;
    private readonly IMongoCollection<Firma> _firme;
    private readonly IMongoCollection<Oglas> _oglasi;

    public AdminService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient) 
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _korisnici = db.GetCollection<Korisnik>(settings.KorisniciCollectionName);
        _majstori = db.GetCollection<Majstor>(settings.MajstoriCollectionName);
        _firme = db.GetCollection<Firma>(settings.FirmeCollectionName);
        _oglasi = db.GetCollection<Oglas>(settings.OglasiCollectionName);
    }

    public async Task<List<User>> GetAllBlockedUsers()
    {
        List<User> usersKorisnici = (await _korisnici.Find(korisnik => korisnik.Blocked==true).ToListAsync()).Cast<User>().ToList();
        List<User> usersFirma = (await _firme.Find(firma => firma.Blocked == true).ToListAsync()).Cast<User>().ToList();
        List<User> usersMajstor = (await _majstori.Find(majstor => majstor.Blocked == true).ToListAsync()).Cast<User>().ToList();
        return usersKorisnici.Concat(usersFirma).Concat(usersMajstor).ToList();
    }

    public async Task<bool> BlockUser(string adminId, string userId, Roles role)
    {
        var adminKorisnik = await _korisnici.Find(korisnik => korisnik.Id == adminId).FirstOrDefaultAsync();
        var adminFirma = await _firme.Find(firma => firma.Id == adminId).FirstOrDefaultAsync();
        var adminMajstor = await _majstori.Find(majstor => majstor.Id == adminId).FirstOrDefaultAsync();
        Korisnik? korisnik = null;

        if (adminKorisnik is not null || adminFirma is not null || adminMajstor is not null)
        {
            switch (role)
            {
                case Roles.Firma:
                    await _firme.FindOneAndUpdateAsync(firma => firma.Id == userId,
                                                        Builders<Firma>.Update.Set(x => x.Blocked, true));
                    return true;
                case Roles.Majstor:
                    await _majstori.FindOneAndUpdateAsync(majstor => majstor.Id == userId,
                                                        Builders<Majstor>.Update.Set(x => x.Blocked, true));
                    return true;
                case Roles.Korisnik:
                    korisnik = await _korisnici.FindOneAndUpdateAsync(korisnik => korisnik.Id == userId,
                                                            Builders<Korisnik>.Update.Set(x => x.Blocked, true));
                    break;
                default:
                    return false;
            }

            var oglasFilter = Builders<Oglas>.Filter.In(o => o.Id, korisnik.OglasiId);

            var updateOglasi = Builders<Oglas>.Update.Set("private", true);

            await _oglasi.UpdateManyAsync(oglasFilter, updateOglasi);
            return true;
        }
        return false;
    }

    public async Task<bool> SignUpAsAdmin(string userId)
    {
        var filter = Builders<Korisnik>.Filter.Eq(u => u.Admin, AdminRole.SudoAdmin);
        var admin = await _korisnici.Find(filter).FirstOrDefaultAsync();
        if (admin.Prijave.Contains(userId))
        {
            return false;
        }
        admin.Prijave.Add(userId);
        var update = Builders<Korisnik>.Update.Set(x => x.Prijave, admin.Prijave);
        await _korisnici.UpdateOneAsync(filter, update);
        return true;
    }

    public async Task<bool> EnrolAsAdmin(string userId, Roles role)
    {
        var filter = Builders<Korisnik>.Filter.Eq(u => u.Admin, AdminRole.SudoAdmin);
        var admin = await _korisnici.Find(filter).FirstOrDefaultAsync();
        if (!admin.Prijave.Contains(userId))
        {
            return false;
        }
        admin.Prijave.Remove(userId);
        var update = Builders<Korisnik>.Update.Set(x => x.Prijave, admin.Prijave);
        await _korisnici.UpdateOneAsync(filter, update);

        switch (role)
        {
            case Roles.Korisnik:
                var filterUpdateKorisnik = Builders<Korisnik>.Filter.Eq(k => k.Id, userId);
                var korisnikUpdate = Builders<Korisnik>.Update.Set(x => x.Admin, AdminRole.Admin);
                await _korisnici.UpdateOneAsync(filterUpdateKorisnik, korisnikUpdate);
                break;
            case Roles.Firma:
                var filterUpdateFirma = Builders<Firma>.Filter.Eq(k => k.Id, userId);
                var firmaUpdate = Builders<Firma>.Update.Set(x => x.Admin, AdminRole.Admin);
                await _firme.UpdateOneAsync(filterUpdateFirma, firmaUpdate);
                break;
            case Roles.Majstor:
                var filterUpdateMajstor = Builders<Majstor>.Filter.Eq(k => k.Id, userId);
                var majstorUpdate = Builders<Majstor>.Update.Set(x => x.Admin, AdminRole.Admin);
                await _majstori.UpdateOneAsync(filterUpdateMajstor, majstorUpdate);
                break;
            default:
                return false;
        }
        return true;
    }

    public async Task<bool> RejectAdmin(string userId)
    {
        var filter = Builders<Korisnik>.Filter.Eq(u => u.Admin, AdminRole.SudoAdmin);
        var admin = await _korisnici.Find(filter).FirstOrDefaultAsync();
        if (!admin.Prijave.Contains(userId))
        {
            return false;
        }
        admin.Prijave.Remove(userId);
        var update = Builders<Korisnik>.Update.Set(x => x.Prijave, admin.Prijave);
        await _korisnici.UpdateOneAsync(filter, update);
        return true;
    }
}
