namespace MajstorHUB.Responses.Users;

public class LoginResponse
{
    public required string Naziv { get; set; }
    public string? UserId { get; set; }
    public required string JwtToken { get; set; }
    public required RefreshToken RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
    public required Roles Role { get; set; }
    public required AdminRoles Admin { get; set; }
}
