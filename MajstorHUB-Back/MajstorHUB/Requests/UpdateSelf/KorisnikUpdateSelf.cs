namespace MajstorHUB.Requests.UpdateSelf;

public class KorisnikUpdateSelf : UserUpdateSelf
{
    public required string Ime { get; set; }
    public required string Prezime { get; set; }
    public required DateTime DatumRodjenja { get; set; }
}
