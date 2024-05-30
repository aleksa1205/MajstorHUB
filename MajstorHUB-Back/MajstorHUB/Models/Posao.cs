namespace MajstorHUB.Models;

public class Posao
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("korisnik")]
    public required string Korisnik { get; set; }

    [BsonElement("izvodjac")]
    public required string Izvodjac { get; set; }

    [BsonElement("oglas")]
    public required string Oglas { get; set; }

    [BsonElement("cena")]
    public required double Cena { get; set; }

    [BsonElement("opis")]
    public string? Opis { get; set; }

    [JsonIgnore]
    [BsonElement("pocetak_radova")]
    public DateTime PocetakRadova { get; set; } = DateTime.Now;

    [BsonElement("zavrsetak_radova")]
    public required DateTime KrajRadova { get; set; }
}
