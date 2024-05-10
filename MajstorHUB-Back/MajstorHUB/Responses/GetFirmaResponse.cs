namespace MajstorHUB.Responses;

public class GetFirmaResponse : GetUserResponse
{
    public required string PIB { get; set; }
    public required string Naziv { get; set; }
    public List<Struka>? Struke { get; set; }
    public double? Zaradjeno { get; set; }
}
