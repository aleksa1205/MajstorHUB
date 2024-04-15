namespace MajstorHUB.Models;

public class Recenzija
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; init; }

    [BsonElement("recenzent")]
    public required string Recenzent { get; init; }

    [BsonElement("RecenzentType")]
    public required Roles RecenzentType { get; set; }

    [BsonElement("RecenziraniType")]
    public required Roles RecenziraniType { get; set; }

    [BsonElement("recenzirani")]
    public required string Recenzirani { get; init; }

    [Range(1,5)]
    [BsonElement("ocena")]
    public required double Ocena { get; set; }

    [BsonElement("opis")]
    public string Opis { get; set; } = string.Empty;

    [BsonElement("datum_recenzije")]
    public DateTime DatumRecenzije { get; set; } = DateTime.Now;
}