namespace MajstorHUB.Services.RecenzijaService;

public interface IRecenzijaService
{
    public Task<List<RecenzijaOld>> GetAll();
    public Task<RecenzijaOld> GetById(string id);
    public Task<List<RecenzijaOld>> GetByRecenzent(string recenzent);
    public Task<List<RecenzijaOld>> GetByRecenzirani(string recenzirani);
    public Task Create(RecenzijaOld recenzija);
    public Task Update(string id, RecenzijaOld recenzija);
    public Task Delete(string id);
}