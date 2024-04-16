namespace MajstorHUB.Services.RecenzijaService;

public interface IRecenzijaService
{
    public Task<List<Recenzija>> GetAll();
    public Task<Recenzija> GetById(string id);
    public Task<List<Recenzija>> GetByRecenzent(string recenzent);
    public Task<List<Recenzija>> GetByRecenzirani(string recenzirani);
    public Task Create(Recenzija recenzija);
    public Task Update(string id, Recenzija recenzija);
    public Task Delete(string id);
}