namespace MajstorHUB.Models;

public class Firma : User
{
    [BsonElement("pib")]
    [Length(8,8,ErrorMessage = "PIB mora imati 8 cifara!")]
    public required string PIB { get; set; }

    [BsonElement("naziv")]
    public required string Naziv { get; set; }

    [BsonElement("struke")]
    public List<Struka> Struke { get; set; }

    [JsonIgnore]
    [BsonElement("zaradjeno_na_platformi")]
    public double Zaradjeno { get; set; } = 0;
}