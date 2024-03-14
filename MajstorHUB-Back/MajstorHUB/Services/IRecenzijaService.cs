namespace MajstorHUB.Services;

public interface IRecenzijaService
{
    public Task<List<Recenzija>> GetAll();
    public Task<Recenzija> GetById(string id);
    public Task Create(Recenzija recenzija);
    public Task Update(string id, Recenzija recenzija);
    public Task Delete(string id);
}