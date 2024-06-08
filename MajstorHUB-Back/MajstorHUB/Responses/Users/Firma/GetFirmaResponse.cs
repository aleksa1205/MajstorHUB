namespace MajstorHUB.Responses.Users.Firma;

public class GetFirmaResponse : GetUserResponse
{
    public required string PIB { get; set; }
    public required string Naziv { get; set; }
    public double? CenaPoSatu { get; set; }
    public List<Struka>? Struke { get; set; }
    public Iskustvo Iskustvo { get; set; }
    public double Zaradjeno { get; set; }
    public required bool Private { get; set; }
    public required bool Blocked { get; set; }
}
