namespace MajstorHUB.Responses;

public class GetMajstorResponse : GetUserResponse
{
    public Struka? Struka { get; set; }
    public Iskustvo? Iskustvo { get; set; }
    public double? CenaPoSatu { get; set; }
    public double? Zaradjeno { get; set; }
}
