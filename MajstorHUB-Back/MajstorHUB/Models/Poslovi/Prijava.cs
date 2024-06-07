namespace MajstorHUB.Models.Poslovi;

public class Prijava
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("oglas")]
    public required string OglasId { get; set; }

    [BsonElement("izvodjac")]
    public required string IzvodjacId { get; set; }

    [BsonElement("tip")]
    public required Roles TipIzvodjaca { get; set; }

    [BsonElement("ponuda")]
    public required double Ponuda { get; set; }

    [BsonElement("bid")]
    public required int Bid { get; set; }

    [BsonElement("opis")]
    public string? Opis { get; set; }

    [BsonElement("datum_kreiranja")]
    public DateTime DatumKreiranja { get; set; } = DateTime.Now;
}
