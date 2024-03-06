namespace MajstorHUB.Models;

public class Majstor : Korisnik
{
    [BsonElement("struka")]
    public required Struka Struka { get; set; }
}

