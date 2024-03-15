namespace MajstorHUB.Services.KorisnikService;

public interface IKorisnikService
{
    Task<List<Korisnik>> GetAll();
    Task<Korisnik> GetById(string id);
    Task<Korisnik> GetByJmbg(string jmbg);
    Task<Korisnik> GetByEmail(string email);
    Task Create(Korisnik korisnik);
    Task Update(string id, Korisnik korisnik);
    Task Delete(string id);
}