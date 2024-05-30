namespace MajstorHUB.Services.PosaoService;

public interface IPosaoService
{
    Task<List<Posao>> GetAll();
    Task<Posao> GetById(string id);
    Task<List<Posao>> GetByKorisnik(string idKorisnika);
    Task<List<Posao>> GetByIzvodjac(string idIzvodjaca);
    Task Create(Posao posao);
    Task Delete(string id);
}
