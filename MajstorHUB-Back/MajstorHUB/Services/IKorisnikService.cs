namespace MajstorHUB.Services;

public interface IKorisnikService
{
    Task<List<Korisnik>> GetAll();
    Task<Korisnik> Get(string id);
    Task<Korisnik> GetByJmbg(string jmbg);
    Task Create(Korisnik korisnik);
    Task Update(string id, Korisnik korisnik);
    Task Delete(string id);
}