using MajstorHUB.Responses.Prijava;

namespace MajstorHUB.Services.PrijavaService;

public interface IPrijavaService
{
    Task<List<Prijava>> GetAll();
    Task<Prijava> GetById(string id);
    Task<List<PrijavaWithIzvodjacDTO>> GetByOglas(string idOglasa, Oglas oglas);
    Task Create(Prijava prijava);
    Task Delete(string id);
}
