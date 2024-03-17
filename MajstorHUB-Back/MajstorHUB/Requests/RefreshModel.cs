namespace MajstorHUB.Requests;

public class RefreshModel
{
    public required string JwtToken { get; set; }
    public required string RefreshToken { get; set; }
}
