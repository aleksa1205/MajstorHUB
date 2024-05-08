namespace MajstorHUB.Responses;

public class LoginResponse
{
    public string? UserId { get; set; }
    public required string JwtToken { get; set; }
    public required RefreshToken RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
    public required List<string> Roles { get; set; }
}
