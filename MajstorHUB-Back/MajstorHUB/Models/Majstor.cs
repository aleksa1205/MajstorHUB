namespace MajstorHUB.Models;

public class Majstor : Korisnik
{
    [BsonElement("struka")]
    public Struka Struka { get; set; }

    [BsonElement("iskustvo")]
    public Iskustvo Iskustvo { get; set; } = Iskustvo.Nedefinisano;
    
    [BsonElement("cena_po_satu")]    
    public double CenaPoSatu { get; set; }

    [JsonIgnore]
    [BsonElement("zaradjeno_na_platformi")]
    public double Zaradjeno { get; set; } = 0;
}