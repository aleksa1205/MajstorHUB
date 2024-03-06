namespace MajstorHUB.Services;

public interface IMajstorService
{
    Task<List<Majstor>> GetAll();
    Task<Majstor> GetById(string id);
    Task<Majstor> GetByJmbg(string jmbg);
    Task Create(Majstor majstor);
    Task Update(string id, Majstor majstor);
    Task Delete(string id);
}
