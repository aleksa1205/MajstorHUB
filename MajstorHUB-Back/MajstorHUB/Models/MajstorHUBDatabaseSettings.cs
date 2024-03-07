namespace MajstorHUB.Models;

public class MajstorHUBDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string KorisniciCollectionName { get; set; } = null!;
    public string FirmeCollectionName { get; set; } = null!;
    public string MajstoriCollectionName { get; set; } = null!;
    public string SifreCollectionName { get; set; } = null!;
}
