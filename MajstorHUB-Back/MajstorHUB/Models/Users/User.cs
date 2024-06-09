namespace MajstorHUB.Models.Users;

[BsonIgnoreExtraElements]
public abstract class User
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
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

    [BsonElement("novac_na_sajtu")]
    public double NovacNaSajtu { get; set; } = 0;

    [BsonElement("opis")]
    public string? Opis { get; set; } = string.Empty;

    // za korisnika se ovo polje koristi za oglase koje je postavio,
    // za majstore i firme je ovo polje oglasi na koji se prijavio
    [BsonElement("oglasi")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> OglasiId { get; set; } = [];

    [BsonElement("poslovi")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Poslovi { get; set; } = [];

    [BsonElement("ocena")]
    [Range(0, 5)]
    public double Ocena { get; set; } = 0;

    [BsonElement("admin")]
    public AdminRoles Admin { get; set; } = AdminRoles.Nedefinisano;

    [BsonElement("private")]
    public bool Private { get; set; } = false;

    [BsonElement("blocked")]
    public bool Blocked { get; set; } = false;

    [JsonIgnore]
    [BsonElement("refresh_token")]
    public RefreshToken? RefreshToken { get; set; }
}