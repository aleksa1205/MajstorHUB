namespace MajstorHUB.Services;

public interface IFirmaService
{
    Task<List<Firma>> GetAll();
    Task<Firma> GetById(string id);
    Task<Firma> GetByPib(string pib);
    Task<Firma> GetByEmail(string email);
    Task Create(Firma firma);
    Task Update(string id, Firma firma);
    Task Delete(string id);
}
