namespace MajstorHUB.Responses;

public class LoginResponse
{
    public required string JwtToken { get; set; }
    public required string RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
}
