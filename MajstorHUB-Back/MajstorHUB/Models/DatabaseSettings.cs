namespace MajstorHUB.Models
{
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;

        //Collection Korisnici i Firme u MongoDB
        public string KorisniciCollectionName { get; set; } = null!;
        public string FirmeCollectionName { get; set; } = null!;
    }
}
