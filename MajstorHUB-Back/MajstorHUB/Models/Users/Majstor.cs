namespace MajstorHUB.Models.Users;

public class Majstor : Korisnik
{
    [BsonElement("struka")]
    [BsonRepresentation(BsonType.String)]
    public Struka Struka { get; set; }

    [BsonElement("iskustvo")]
    public Iskustvo Iskustvo { get; set; } = Iskustvo.Nedefinisano;


    [BsonElement("cena_po_satu")]
    public double CenaPoSatu { get; set; }

    [BsonElement("zaradjeno_na_platformi")]
    public double Zaradjeno { get; set; } = 0;

    [BsonElement("prijave_na_posta")]
    public string[] PrijaveNaPosao { get; set; } = [];
}