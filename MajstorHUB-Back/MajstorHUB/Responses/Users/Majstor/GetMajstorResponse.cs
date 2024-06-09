namespace MajstorHUB.Responses.Users.Majstor;

public class GetMajstorResponse : GetUserResponse
{
    public required string JMBG { get; set; }
    public string? Ime { get; set; }
    public string? Prezime { get; set; }
    public DateTime? DatumRodjenja { get; set; }
    public Struka? Struka { get; set; }
    public Iskustvo Iskustvo { get; set; }
    public double? CenaPoSatu { get; set; }
    public double Zaradjeno { get; set; }
    public required bool Private { get; set; }
    public required bool Blocked { get; set; }
}
