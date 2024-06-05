namespace MajstorHUB.Requests.Users;

public class UserUpdateSelf
{
    public required string Email { get; set; }
    public required string Slika { get; set; }
    public required string Adresa { get; set; }
    public required string BrojTelefona { get; set; }
    public required string Opis { get; set; }
}
