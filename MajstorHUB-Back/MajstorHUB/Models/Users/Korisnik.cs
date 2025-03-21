﻿namespace MajstorHUB.Models.Users;

[BsonIgnoreExtraElements]
public class Korisnik : User
{
    [Length(13, 13, ErrorMessage = "JMBG mora imati 13 brojeva!")]
    [BsonElement("jmbg")]
    public required string JMBG { get; set; }

    [BsonElement("ime")]
    public string? Ime { get; set; }

    [BsonElement("prezime")]
    public string? Prezime { get; set; }

    [BsonElement("datum_rodjenja")]
    public DateTime? DatumRodjenja { get; set; }

    [BsonElement("potroseno_na_sajtu")]
    public double Potroseno { get; set; } = 0;

    [BsonElement("prijave")]
    public List<string> Prijave { get; set; } = [];
}