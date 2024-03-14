namespace MajstorHUB.Models;

public class Oglas
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("korisnik")]
    public required string KorisnikId { get; set; }

    [BsonElement("naslov")]
    public required string Naslov { get; set; }

    [BsonElement("trazeno_iskustvo")]
    public Iskustvo Iskustvo { get; set; } = Iskustvo.Nedefinisano;

    [BsonElement("tip")]
    public required Struka Tip { get; set; }

    [BsonElement("opis")]
    public required string Opis{ get; set; }

    [BsonElement("datum_kreiranja")]
    [JsonIgnore]
    public DateTime DatumPostavljanja { get; set; } = DateTime.Now;
}