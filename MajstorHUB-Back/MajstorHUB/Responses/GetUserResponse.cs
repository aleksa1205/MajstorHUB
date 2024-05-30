namespace MajstorHUB.Responses;

public class GetUserResponse
{
    public string? Id { get; set; }
    public string? Email { get; set; }
    public string? Slika { get; set; }
    public string? Adresa { get; set; }
    public string? BrojTelefona { get; set; }
    public DateTime DatumKreiranjaNaloga { get; set; }
    public double NovacNaSajtu { get; set; }
    public string? Opis { get; set; }
}
