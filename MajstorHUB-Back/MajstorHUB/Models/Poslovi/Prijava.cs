namespace MajstorHUB.Models.Poslovi;

public class Prijava
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("oglas")]
    public required string Oglas { get; set; }

    [BsonElement("izvodjac")]
    public required string Izvodjac { get; set; }

    [BsonElement("tip")]
    public required Roles TipIzvodjaca { get; set; }

    [BsonElement("ponuda")]
    public required double Ponuda { get; set; }

    [BsonElement("opis")]
    public string? Opis { get; set; }
}
