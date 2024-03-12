namespace MajstorHUB.Models;

public class Majstor : User
{
    [BsonElement("jmbg")]
    [Length(13, 13, ErrorMessage = "JMBG mora imati 13 brojeva!")]
    public required string JMBG { get; set; }

    [BsonElement("ime")]
    public required string Ime { get; set; }

    [BsonElement("prezime")]
    public required string Prezime { get; set; }

    [BsonElement("datum_rodjenja")]
    public DateTime? DatumRodjenja { get; set; }

    [BsonElement("struka")]
    public required Struka Struka { get; set; }
}

