using MajstorHUB.Authorization;

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

    [Authorize]
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
            return Ok(firma);
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

    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Post([FromBody] Firma firma)
    {
        try
        {
            firma.Password = BCrypt.Net.BCrypt.HashPassword(firma.Password);

            if ((await _firmaService.GetByPib(firma.PIB)) != null)
                return BadRequest($"Firma sa PIB-om {firma.PIB} vec postoji!\n");
            if ((await _firmaService.GetByEmail(firma.Email)) != null)
                return BadRequest($"Firma sa Email-om {firma.Email} vec postoji!\n");

            await _firmaService.Create(firma);
            return Ok($"Uspesno dodata firma sa ID-em {firma.Id}!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Login/{email}/{password}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login(string email, string password)
    {
        try
        {
            var firma = await _firmaService.GetByEmail(email);
            if (firma is null)
                return BadRequest("Firma sa zadatim Email-om ne postoji!\n");

            var hashPassword = BCrypt.Net.BCrypt.Verify(password, firma.Password);
            if (!hashPassword)
            {
                return BadRequest("Pogresna sifra!\n");
            }

            var token = new JwtProvider(_configuration).Generate(firma);

            string refreshToken = RefreshProvider.GenerateRefreshToken();
            DateTime expiry = DateTime.UtcNow.AddMinutes(1);

            await _firmaService.UpdateRefreshToken(firma.Id!, refreshToken, expiry);

            return Ok(new LoginResponse
            {
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                RefreshToken = refreshToken
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
            var principal = jwtProvider.GetPrincipalFromExpiredToken(model.AccessToken);

            if (principal?.Identity?.Name is null)
                return Unauthorized(); // ne prikazuje se greska korisniku zasto nije autorizovan zbog bezbednosnih razloga

            var firma = await _firmaService.GetByEmail(principal.Identity.Name);

            if (firma is null ||
                firma.RefreshToken != model.RefreshToken ||
                firma.RefreshTokenExpiry < DateTime.UtcNow)
                return Unauthorized();

            var token = jwtProvider.Generate(firma);

            return Ok(new LoginResponse
            {
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = model.RefreshToken,
                Expiration = token.ValidTo
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpDelete("Logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var email = HttpContext.User.Identity?.Name;

            if (email is null)
                return Unauthorized();

            var firma = await _firmaService.GetByEmail(email);

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
}