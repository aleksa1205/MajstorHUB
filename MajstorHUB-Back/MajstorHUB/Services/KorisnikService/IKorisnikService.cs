namespace MajstorHUB.Services.KorisnikService;

public interface IKorisnikService
{
    Task<List<Korisnik>> GetAll();
    Task<Korisnik> GetById(string id);
    Task<Korisnik> GetByJmbg(string jmbg);
    Task<Korisnik> GetByEmail(string email);
    Task Create(Korisnik korisnik);
    Task Update(string id, Korisnik korisnik);
    Task UpdateRefreshToken(string id, RefreshToken token);
    Task<List<Korisnik>> Filter(string ime, string prezime);
    Task Delete(string id);
    Task DeleteRefreshToken(string id);
}