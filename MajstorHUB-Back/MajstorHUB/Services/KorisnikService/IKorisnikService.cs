namespace MajstorHUB.Services.KorisnikService;

public interface IKorisnikService
{
    Task<List<Korisnik>> GetAll();
    Task<Korisnik> GetById(string id);
    Task<GetKorisnikResponse> GetByIdDto(string id);
    Task<Korisnik> GetByJmbg(string jmbg);
    Task<Korisnik> GetByEmail(string email);
    Task Create(Korisnik korisnik);
    Task Update(string id, Korisnik korisnik);
    Task UpdateSelf(string id, KorisnikUpdateSelf korisnik);
    Task UpdateMoney(string id, double amount);
    Task UpdateRefreshToken(string id, RefreshToken token);
    Task<List<GetKorisnikResponse>> Filter(FilterKorisnikDto korisnik);
    Task Delete(string id);
    Task DeleteRefreshToken(string id);
}