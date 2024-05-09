namespace MajstorHUB.Responses;

public class GetUserResponse
{
    public string? Id { get; set; }
    public required string Email { get; set; }
    public string? Slika { get; set; }
    public string? Adresa { get; set; }
    public string? BrojTelefona { get; set; }
    public required DateTime DatumKreiranjaNaloga { get; set; }
    public required double NovacNaSajtu { get; set; }
    public string? Opis { get; set; }
}
