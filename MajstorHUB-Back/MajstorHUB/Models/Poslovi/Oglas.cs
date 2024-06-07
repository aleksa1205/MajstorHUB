namespace MajstorHUB.Models.Poslovi;

public class Oglas
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("korisnik")]
    public required string KorisnikId { get; set; }

    [BsonElement("prijave")]
    public List<string> PrijaveIds { get; set; } = [];

    [BsonElement("naslov")]
    public required string Naslov { get; set; }

    [BsonElement("iskustvo")]
    public Iskustvo Iskustvo { get; set; } = Iskustvo.Nedefinisano;

    [BsonElement("struke")]
    public List<Struka> Struke { get; set; } = [];

    [BsonElement("opis")]
    public required string Opis { get; set; }

    [BsonElement("cena")]
    public required double Cena { get; set; }

    [BsonElement("duzina_posla")]
    public DuzinaPosla DuzinaPosla { get; set; } = DuzinaPosla.Nedefinisano;

    [BsonElement("lokacija")]
    public string? Lokacija { get; set; }

    [JsonIgnore]
    [BsonElement("datum_kreiranja")]
    public DateTime DatumKreiranja { get; set; } = DateTime.Now;

    [JsonIgnore]
    [BsonElement("private")]
    public bool Private { get; set; } = false;

    [JsonIgnore]
    [BsonElement("Active")]
    public bool Active { get; set; } = true;
}