namespace MajstorHUB.Services.ReportService;

public interface IReportService
{
    Task<List<Report>> GetAll();
    Task<Report> GetByID(string id);
    Task<List<Report>> GetByReported(string reportedId);
    Task Create(Report report);
    Task Delete(string reportedId);
}
