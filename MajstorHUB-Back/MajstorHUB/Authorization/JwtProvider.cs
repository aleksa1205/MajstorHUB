using Microsoft.Extensions.Configuration;

namespace MajstorHUB.Authorization;

public class JwtProvider
{
    private readonly JwtOptions _options;

    public JwtProvider(IConfiguration confing)
    {
        _options = new JwtOptions(confing);
    }

    public JwtSecurityToken Generate(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.Id!),
        };

        // Hard kodirano je ovako, ako zatreba uradicemo na bolji nacin
        if (user is Majstor)
            claims.Add(new("Role", Roles.Majstor.ToString()));
        else if (user is Korisnik)
            claims.Add(new("Role", Roles.Korisnik.ToString()));
        else if (user is Firma)
            claims.Add(new("Role", Roles.Firma.ToString()));

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_options.SecretKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _options.Issuer,
            _options.Audience,
            claims,
            null,
            DateTime.UtcNow.Add(_options.JwtLifetime),
            signingCredentials);

        return token;

        //string tokenValue = new JwtSecurityTokenHandler()
        //    .WriteToken(token);

        //return tokenValue;
    }

    // Proverava jwt token da li je validan
    public ClaimsPrincipal? GetPrincipalFromExpiredToken (string? token)
    {
        var secret = _options.SecretKey ?? throw new InvalidOperationException("Tajni kljuc nije konfigurisan");

        var validation = new TokenValidationParameters
        {
            // proverava da li je ovaj ko potpisuje token validan
            ValidIssuer = _options.Issuer,
            ValidAudience = _options.Audience,
            // proverava da li je kljuc u redu
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey)),
            // BITNO
            // Ako je istekao token nece da baci false kao proveru
            // jer je nama svejedno istekao token pa zelimo da ga regenerisemo
            ValidateLifetime = false
        };

        return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
    }
}
