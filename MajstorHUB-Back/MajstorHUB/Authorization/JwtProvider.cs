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
        var claims = new Claim[]
        {
            new(JwtRegisteredClaimNames.Sub, user.Id!),
            new(JwtRegisteredClaimNames.Email, user.Email)
        };

        //Console.WriteLine(user.GetType());

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
