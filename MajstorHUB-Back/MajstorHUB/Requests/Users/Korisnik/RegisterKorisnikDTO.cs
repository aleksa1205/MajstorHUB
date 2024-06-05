namespace MajstorHUB.Requests.Users.Korisnik;

public class RegisterKorisnikDTO
{
    public required string Ime { get; set; }
    public required string Prezime { get; set; }
    public required string JMBG { get; set; }
    public required string Email { get; set; }
    public required string Sifra { get; set; }

}
