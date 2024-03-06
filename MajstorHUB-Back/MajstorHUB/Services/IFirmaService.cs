namespace MajstorHUB.Services;

public interface IFirmaService
{
    Task<Firma> GetByPib(string pib);
    Task<Firma> Get(string id);
    Task<List<Firma>> GetAll();
    Task<Firma> Create(Firma firma);
    void Update(string id, Firma firma);
    void Delete(string id);
}
