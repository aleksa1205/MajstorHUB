namespace MajstorHUB.Services.ReportService;

public class ReportService : IReportService
{
    private readonly IMongoCollection<Report> _reports;

    public ReportService(MajstorHUBDatabaseSettings settings, IMongoClient mongoClient)
    {
        var db = mongoClient.GetDatabase(settings.DatabaseName);
        _reports = db.GetCollection<Report>(settings.ReportCollectionName);
    }

    public async Task<List<Report>> GetAll()
    {
        return await _reports.Find(report => true).ToListAsync();
    }

    public async Task<Report> GetByID(string id)
    {
        return await _reports.Find(report => report.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<Report>> GetByReported(string reportedId)
    {
        return await _reports.Find(report=>report.Prijavljeni==reportedId).ToListAsync();
    }

    public async Task Create(Report report)
    {
        await _reports.InsertOneAsync(report);
    }

    public async Task Delete(string id)
    {
        await _reports.DeleteOneAsync(report => report.Id == id);
    }
}
