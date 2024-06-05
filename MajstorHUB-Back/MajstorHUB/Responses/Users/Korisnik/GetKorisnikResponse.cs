namespace MajstorHUB.Responses.Users.Korisnik;

public class GetKorisnikResponse : GetUserResponse
{
    public required string JMBG { get; set; }
    public string? Ime { get; set; }
    public string? Prezime { get; set; }
    public DateTime? DatumRodjenja { get; set; }
    public double Potroseno { get; set; }
}
