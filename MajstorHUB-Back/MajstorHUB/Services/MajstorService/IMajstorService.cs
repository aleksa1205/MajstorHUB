namespace MajstorHUB.Services.MajstorService;

public interface IMajstorService
{
    Task<List<Majstor>> GetAll();
    Task<Majstor> GetById(string id);
    Task<Majstor> GetByJmbg(string jmbg);
    Task<Majstor> GetByEmail(string email);
    Task Create(Majstor majstor);
    Task Update(string id, Majstor majstor);
    Task UpdateRefreshToken(string id, RefreshToken token);
    Task<List<Majstor>> Filter(string ime, string prezime, Struka struka);
    Task Delete(string id);
    Task DeleteRefreshToken(string id);
}
