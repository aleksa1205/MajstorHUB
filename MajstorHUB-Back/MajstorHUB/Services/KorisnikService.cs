using MajstorHUB.Models;
using MongoDB.Driver;

namespace MajstorHUB.Services
{
    public class KorisnikService : IKorisnikService
    {
        private readonly IMongoCollection<Korisnik> _korisnici;

        public KorisnikService(DatabaseSettings settings, IMongoClient mongoClient)
        {
            var db = mongoClient.GetDatabase(settings.DatabaseName);
            _korisnici = db.GetCollection<Korisnik>(settings.KorisniciCollectionName);
        }

        //Probaj da sredis bajo ako ocemo da bude async kako da uradimo ako skinemo async i bude normalna metoda sve radi kako treba
        //public async Task<List<Korisnik>> Get()
        //{
        //    return await _korisnici.FindAsync(korisnik => true).ToList();
        //}

        public async Task<Korisnik> Get(string id)
        {
            return await _korisnici.Find(korisnik => korisnik.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Korisnik> Create(Korisnik korisnik)
        {
            await _korisnici.InsertOneAsync(korisnik);
            return korisnik;
        }

        public async void Update(string id, Korisnik korisnik)
        {
            await _korisnici.ReplaceOneAsync(korisnik => korisnik.Id == id, korisnik);
            return;
        }

        public async void Delete(string id)
        {
            await _korisnici.DeleteOneAsync(korisnik => korisnik.Id == id);
            return;
        }
    }
}
