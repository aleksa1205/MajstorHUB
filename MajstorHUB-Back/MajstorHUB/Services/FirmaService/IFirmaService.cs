namespace MajstorHUB.Services.FirmaService;

public interface IFirmaService
{
    Task<List<Firma>> GetAll();
    Task<Firma> GetById(string id);
    Task<GetFirmaResponse> GetByIdDto(string id);
    Task<Firma> GetByPib(string pib);
    Task<Firma> GetByEmail(string email);
    Task Create(Firma firma);
    Task Update(string id, Firma firma);
    Task UpdateSelf(string id, FirmaUpdateSelf firma);
    Task UpdateMoney(string id, double amount);
    // Moze samo i preko Update funkcije, ali reko da bude bezbednije da se koriste posebne
    // funkcija samo za refresh token
    Task UpdateRefreshToken(string id, RefreshToken token);
    Task Delete(string id);
    Task DeleteRefreshToken(string id);
    Task<List<GetFirmaResponse>> Filter(FilterFirmaDTO firma);
}
