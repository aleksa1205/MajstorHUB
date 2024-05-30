namespace MajstorHUB.Services.MajstorService;

public interface IMajstorService
{
    Task<List<Majstor>> GetAll();
    Task<Majstor> GetById(string id);
    Task<GetMajstorResponse> GetByIdDto(string id);
    Task<Majstor> GetByJmbg(string jmbg);
    Task<Majstor> GetByEmail(string email);
    Task Create(Majstor majstor);
    Task Update(string id, Majstor majstor);
    Task UpdateSelf(string id, MajstorUpdateSelf majstor);
    Task UpdateMoney(string id, double amount);
    Task UpdateRefreshToken(string id, RefreshToken token);
    Task<List<GetMajstorResponse>> Filter(FIlterMajstorDTO majstor);
    Task Delete(string id);
    Task DeleteRefreshToken(string id);
}
