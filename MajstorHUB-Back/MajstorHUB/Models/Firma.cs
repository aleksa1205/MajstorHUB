namespace MajstorHUB.Models;

public class Firma : User
{
    [BsonElement("pib")]
    [Length(8,8,ErrorMessage = "PIB mora imati 8 cifara!")]
    public required string PIB { get; set; }

    [BsonElement("naziv")]
    public required string Naziv { get; set; }

    [BsonElement("struke")]
    public required List<Struka> Struke { get; set; }

    [BsonElement("zaradjeno_na_platformi")]
    [JsonIgnore]
    public double Zaradjeno { get; set; } = 0;
}