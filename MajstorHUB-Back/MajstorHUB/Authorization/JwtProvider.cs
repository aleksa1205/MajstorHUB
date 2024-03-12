namespace MajstorHUB.Authorization;

public class JwtProvider
{
    private readonly JwtOptions _options;

    public JwtProvider(IConfiguration confing)
    {
        _options = new JwtOptions(confing);
    }


    public string Generate(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id!),
            new(JwtRegisteredClaimNames.Email, user.Email)
        };


        // Hard kodirano je ovako, ako zatreba uradicemo na bolji nacin
        if (user is Korisnik)
            claims.Add(new("Role", Roles.Korisnik.ToString()));
        else if (user is Majstor)
            claims.Add(new("Role", Roles.Majstor.ToString()));
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
            DateTime.UtcNow.AddHours(1),
            signingCredentials);

        string tokenValue = new JwtSecurityTokenHandler()
            .WriteToken(token);

        return tokenValue;
    }
}
