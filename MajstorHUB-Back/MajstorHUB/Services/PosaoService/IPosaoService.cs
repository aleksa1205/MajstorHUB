using MajstorHUB.Responses.Posao;

namespace MajstorHUB.Services.PosaoService;

public interface IPosaoService
{
    Task<List<Posao>> GetAll();
    Task<Posao> GetById(string id);
    Task<Posao> GetByOglas(string oglasId);
    Task<List<GetByZapocetiDTO>> GetByUserZapoceti(string userId, Roles userType);
    //Task<List<GetByZapocetiDTO>> GetByUserZavrseni(string userId, Roles userType);
    Task ZavrsiByKorisnik(ZavrsiPosaoDTO zavrsi);
    Task ZavrsiByIzvodjac(ZavrsiPosaoDTO zavrsi);
    Task Create(Posao posao);
    Task Delete(string id);
}
