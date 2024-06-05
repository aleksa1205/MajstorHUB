namespace MajstorHUB.Services.PrijavaService;

public interface IPrijavaService
{
    Task<List<Prijava>> GetAll();
    Task<Prijava> GetById(string id);
    Task<List<Prijava>> GetByOglas(string idOglasa);
    Task Create(Prijava prijava);
    Task Delete(string id);
}
