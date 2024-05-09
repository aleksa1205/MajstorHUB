using MajstorHUB.Authorization;
using System.Collections.Immutable;

namespace MajstorHUB.Controllers;

[ApiController]
[Route("[controller]")]
public class FirmaController : ControllerBase
{
    private readonly IFirmaService _firmaService;
    private IConfiguration _configuration;

    public FirmaController(IFirmaService firmeService, IConfiguration configuration)
    {
        this._firmaService = firmeService;
        this._configuration = configuration;
    }

    [HttpGet("EmailExists/{email}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> EmailExists(string email)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(email))
                return BadRequest("Email je pogresnog formata");

            bool exists = await _firmaService.GetByEmail(email) != null;
            return Ok(exists);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PibExists/{pib}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PibExists(string pib)
    {
        try
        {
            if (!UtilityCheck.IsValidPib(pib))
                return BadRequest("Pib mora zadrzati 8 broja");

            bool exists = await _firmaService.GetByPib(pib) != null;
            return Ok(exists);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Firma)]
    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var firme = await _firmaService.GetAll();
            if (firme.Count == 0)
                return NotFound("Nijedna firma ne postoji u bazi!\n");

            return Ok(firme);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByID/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string id)
    {
        try
        {
            var firma = await _firmaService.GetById(id);
            if (firma == null)
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");

            var getResponse = new GetFirmaResponse
            {
                DatumKreiranjaNaloga = firma.DatumKreiranjaNaloga,
                Email = firma.Email,
                Naziv = firma.Naziv,
                NovacNaSajtu = firma.NovacNaSajtu,
                PIB = firma.PIB,
                Adresa = firma.Adresa,
                BrojTelefona = firma.BrojTelefona,
                Id = firma.Id,
                Opis = firma.Opis,
                Slika = firma.Slika,
                Struke = firma.Struke,
                Zaradjeno = firma.Zaradjeno,
            };

            return Ok(getResponse);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByPib/{pib}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByPib(string pib)
    {
        try
        {
            if (!UtilityCheck.IsValidPib(pib)) return BadRequest("Pib mora sadrzati 8 broja!\n");
            var firma = await _firmaService.GetByPib(pib);
            if (firma == null)
                return NotFound($"Firma sa zadatim PIB-om {pib} ne postoji!\n");
            return Ok(firma);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByEmail/{email}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByEmail(string email)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(email)) return BadRequest("\"Pogresan format email-a!\n");
            var firma = await _firmaService.GetByEmail(email);
            if (firma == null)
                return NotFound($"Firma sa Email-om {email} ne postoji!\n");
            return Ok(firma);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(RegisterFirmaDTO firmaDto)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(firmaDto.Email))
                return BadRequest("Format emaila pogresan");
            if (!UtilityCheck.IsValidPib(firmaDto.PIB))
                return BadRequest("PIB mora da zadrzi 8 broja");
            if ((await _firmaService.GetByPib(firmaDto.PIB)) != null)
                return BadRequest($"Firma sa PIB-om {firmaDto.PIB} vec postoji!\n");
            if ((await _firmaService.GetByEmail(firmaDto.Email)) != null)
                return BadRequest($"Firma sa Email-om {firmaDto.Email} vec postoji!\n");

            Firma firma = new Firma
            {
                Naziv = firmaDto.ImeFirme,
                PIB = firmaDto.PIB,
                Email = firmaDto.Email,
                Password = firmaDto.Sifra
            };

            firma.Password = BCrypt.Net.BCrypt.HashPassword(firma.Password);

            await _firmaService.Create(firma);
            return Ok($"Uspesno dodata firma sa ID-em {firma.Id}!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(LoginDTO loginDto)
    {
        try
        {
            string email = loginDto.Email;
            string password = loginDto.Password;

            if (!UtilityCheck.IsValidEmail(email))
                return BadRequest("Pogresan format email-a!");

            var firma = await _firmaService.GetByEmail(email);
            if (firma is null)
                return BadRequest("Firma sa zadatim Email-om ne postoji!\n");

            var hashPassword = BCrypt.Net.BCrypt.Verify(password, firma.Password);

            if (!hashPassword)
            {
                return Unauthorized("Pogresna sifra!\n");
            }

            var token = new JwtProvider(_configuration).Generate(firma);

            List<string> roles = new List<string>();

            foreach (var claim in token.Claims)
            {
                if (claim.Type == "Role")
                    roles.Add(claim.Value);
            }

            var refresh = new RefreshToken
            {
                TokenValue = RefreshProvider.GenerateRefreshToken(),
                Expiry = DateTime.UtcNow.Add(new JwtOptions(_configuration).RefreshTokenLifetime),
                JwtId = token.Id
            };

            await _firmaService.UpdateRefreshToken(firma.Id!, refresh);

            return Ok(new LoginResponse
            {
                Naziv = firma.Naziv,
                UserId = firma.Id!,
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                RefreshToken = refresh,
                Roles = roles
            });

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Refresh")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh([FromBody] RefreshModel model)
    {
        try
        {
            var jwtProvider = new JwtProvider(_configuration);
            var principal = jwtProvider.GetPrincipalFromExpiredToken(model.JwtToken);

            if (principal?.Identity?.Name is null)
                return Unauthorized(); // ne prikazuje se greska korisniku zasto nije autorizovan iz bezbednosnih razloga

            // Provera datuma access tokena, malo je komplikovano jer se datum isteka tokena pamti kao
            // sekude od datuma 01.01.1970 00:00:00
            JwtOptions options = new JwtOptions(_configuration);
            var expiryDateUnix =
                long.Parse(principal.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
            var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                .AddSeconds(expiryDateUnix);

            if (expiryDateTimeUtc > DateTime.UtcNow)
                return Unauthorized();

            var firma = await _firmaService.GetById(principal.Identity.Name);
            var jwtId = principal.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            if (firma is null ||
                firma.RefreshToken?.JwtId != jwtId ||
                firma.RefreshToken.TokenValue != model.RefreshToken ||
                firma.RefreshToken.Expiry < DateTime.UtcNow
                )
                    return Unauthorized();

            var token = jwtProvider.Generate(firma);

            List<string> roles = new List<string>();

            foreach (var claim in token.Claims)
            {
                if (claim.Type == "Role")
                    roles.Add(claim.Value);
            }

            var newRefreshToken = new RefreshToken
            {
                TokenValue = RefreshProvider.GenerateRefreshToken(),
                Expiry = DateTime.UtcNow.Add(new JwtOptions(_configuration).RefreshTokenLifetime),
                JwtId = token.Id
            };
            await _firmaService.UpdateRefreshToken(firma.Id!, newRefreshToken);


            return Ok(new LoginResponse
            {
                Naziv = firma.Naziv,
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = newRefreshToken,
                Expiration = token.ValidTo,
                Roles = roles
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Firma)]
    [HttpDelete("Logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;

            if (id is null)
                return Unauthorized();

            var firma = await _firmaService.GetById(id);

            if (firma is null)
                return Unauthorized();

            await _firmaService.DeleteRefreshToken(firma.Id!);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Prosek/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Average(string id)
    {
        try
        {
            var firma = await _firmaService.GetById(id);
            if (firma is null)
                return NotFound($"Firma za ID-em {id} ne postoji!\n");
            if (firma.Recenzija.Count == 0)
                return BadRequest("Firma nema nijednu recenziju!\n");
            double avg = 0;
            foreach (var element in firma.Recenzija)
                avg += element.Ocena;
            avg /= firma.Recenzija.Count;
            return Ok(avg);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("Update/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(String id, [FromBody] Firma firma)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(firma.Email))
                return BadRequest("Format emaila pogresan");
            if(!UtilityCheck.IsValidPib(firma.PIB))
                return BadRequest("PIB mora da zadrzi 8 broja");
            if ((await _firmaService.GetByPib(firma.PIB)) != null)
                return BadRequest($"Firma sa PIB-om {firma.PIB} vec postoji!\n");
            if ((await _firmaService.GetByEmail(firma.Email)) != null)
                return BadRequest($"Firma sa Email-om {firma.Email} vec postoji!\n");

            var postojecaFirma = await _firmaService.GetById(id);
            if (postojecaFirma == null)
            {
                return NotFound($"Firma sa ID-em {id} ne posotji!\n");
            }
            await _firmaService.Update(id, firma);
            return Ok($"Firma sa ID-em {id} je uspesno azurirana!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("Delete/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var postojecaFirma = await _firmaService.GetById(id);
            if (postojecaFirma == null)
            {
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");
            }
            await _firmaService.Delete(id);
            return Ok($"Firma sa ID-em {id} je uspesno obrisana!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Filter")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Filter(FilterDTO filter)
    {
        try
        {
            var filterList = await _firmaService.Filter(filter.Ime, filter.Struka);
            if (filterList.Count == 0)
            {
                return NotFound("Firma sa zadatim nazivom i strukom nije pronadjena!\n");
            }
            return Ok(filterList);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}