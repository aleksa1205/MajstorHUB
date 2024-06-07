namespace MajstorHUB.Models.DatabaseSettings;

public class MajstorHUBDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string KorisniciCollectionName { get; set; } = null!;
    public string FirmeCollectionName { get; set; } = null!;
    public string MajstoriCollectionName { get; set; } = null!;
    public string SifreCollectionName { get; set; } = null!;
    public string OglasiCollectionName { get; set; } = null!;
    public string RecenzijeCollectionName { get; set; } = null!;
    public string PosloviCollectionName { get; set; } = null!;
    public string PrijaveCollectionName { get; set; } = null!;
    public string AdminCollectionName { get; set; } = null!;
    public string ReportCollectionName { get; set; } = null!;
}
