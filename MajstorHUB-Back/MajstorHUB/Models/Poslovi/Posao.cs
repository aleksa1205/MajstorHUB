namespace MajstorHUB.Models.Poslovi;

public class Posao
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("korisnik")]
    public required string Korisnik { get; set; }

    [BsonElement("izvodjac")]
    public required Izvodjac Izvodjac { get; set; }

    [BsonElement("detalji_posla")]
    public required DetaljiPosla DetaljiPosla { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("oglas")]
    public required string Oglas { get; set; }

    [BsonElement("recenzije")]
    public Recenzije Recenzije { get; set; } = new Recenzije();

    [BsonElement("pocetak_radova")]
    public DateTime PocetakRadova { get; set; } = DateTime.Now;

    [BsonElement("zavrsetak_radova")]
    public required DateTime ZavrsetakRadova { get; set; }

    [BsonElement("zavrsen")]
    public bool Zavrsen { get; set; } = false;
}

public class DetaljiPosla
{
    public required double Cena { get; set; }
    public required string Naslov { get; set; }
    public required string Opis { get; set; }
}

public class Recenzije
{
    public Recenzija? RecenzijaKorisnika { get; set; }
    public Recenzija? RecenzijaIzvodjaca { get; set; }
}

public class Recenzija
{
    [Range(1, 5)]
    public required double Ocena { get; set; }
    public required string OpisRecenzije { get; set; }
}