namespace MajstorHUB.Authorization;

public class RefreshToken
{
    public required string TokenValue { get; set; } 
    public required DateTime Expiry { get; set; }
    public required string JwtId{ get; set; }
}
