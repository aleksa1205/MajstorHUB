namespace MajstorHUB.Responses;

public class LoginResponse
{
    public required string JwtToken { get; set; }
    public required RefreshToken RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
}
