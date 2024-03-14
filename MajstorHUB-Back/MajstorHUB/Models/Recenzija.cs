namespace MajstorHUB.Models;

public class Recenzija
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; init; }

    [BsonElement("recenzent")]
    public required string Recenzent { get; init; }

    [BsonElement("recenzirani")]
    public required string Recenzirani { get; init; }

    [Range(0,5)]
    [BsonElement("ocena")]
    public required double Ocena { get; set; }

    [BsonElement("opis")]
    public string Opis { get; set; } = string.Empty;

    [BsonElement("datum_recenzije")]
    public DateTime DatumRecenzije { get; set; } = DateTime.Now;
}