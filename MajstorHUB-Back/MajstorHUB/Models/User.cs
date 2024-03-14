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
    
    [BsonElement("slika")]
    public string? Slika { get; set; } = string.Empty;
    
    [BsonElement("adresa")]
    public string? Adresa { get; set; }

    [BsonElement("broj_telefona")]
    public string? BrojTelefona { get; set; }

    [JsonIgnore]
    [BsonElement("datum_kreiranja")]
    public DateTime DatumKreiranjaNaloga { get; set; } = DateTime.Now;

    //mozda ce se obrise jsonignore
    //mozda int al da moz bude 4.5 i tako
    [JsonIgnore]
    [BsonElement("ocene")]
    public List<float> Ocene { get; set; }=new List<float>();

    [BsonElement("novac_na_sajtu")]
    public double NovacNaSajtu { get; set; } = 0;
    
    [BsonElement("opis")]
    public string? Opis { get; set; }=string.Empty;
}