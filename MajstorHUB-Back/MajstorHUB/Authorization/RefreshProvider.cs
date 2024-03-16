using System.Security.Cryptography;

namespace MajstorHUB.Authorization;

public class RefreshProvider
{
    public static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];

        using var generator = RandomNumberGenerator.Create();

        generator.GetBytes(randomNumber);

        return Convert.ToBase64String(randomNumber);
    }
}
