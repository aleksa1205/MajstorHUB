namespace MajstorHUB.Models;

public abstract class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("email")]
    [EmailAddress(ErrorMessage = "Format Email-a pogresan")]
    public required string Email { get; set; }

    [BsonElement("password")]
    public required string Password { get; set; }
    [BsonElement("adresa")]
    public string? Adresa { get; set; }

    [BsonElement("broj_telefona")]
    public string? BrojTelefona { get; set; }

    [BsonElement("datum_kreiranja")]
    public DateTime DatumKreiranjaNaloga { get; set; } = DateTime.Now;

    [BsonElement("novac_na_sajtu")]
    public double NovacNaSajtu { get; set; } = 0;
}