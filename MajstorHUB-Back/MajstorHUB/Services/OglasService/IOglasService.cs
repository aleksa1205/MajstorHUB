namespace MajstorHUB.Services.OglasService;

public interface IOglasService
{
    Task<List<Oglas>> GetAll();
    Task<Oglas> GetById(string id);
    Task<List<Oglas>> GetByKorisnik(string korisnikId);
    Task Create(Oglas oglas);
    Task Update(string id, Oglas oglas);
    Task UpdateSelf(OglasUpdateSelf oglas);
    Task Delete(string id);
    Task<List<GetOglasDTO>> Filter(FilterOglasDTO oglas);
}
