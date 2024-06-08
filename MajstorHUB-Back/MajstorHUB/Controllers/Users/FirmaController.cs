namespace MajstorHUB.Controllers.Users;

[ApiController]
[Route("[controller]")]
public class FirmaController : ControllerBase
{
    private readonly IFirmaService _firmaService;
    private IConfiguration _configuration;

    public FirmaController(IFirmaService firmeService, IConfiguration configuration)
    {
        _firmaService = firmeService;
        _configuration = configuration;
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

    [Authorize]
    [HttpGet("GetByID/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Get(string id)
    {
        try
        {
            var ownerId = HttpContext.User.Identity?.Name;
            var firma = await _firmaService.GetByIdDto(id);
            if (firma == null)
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");
            if ((firma.Blocked || firma.Private) && ownerId != firma.Id)
                return Forbid();

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
            if (await _firmaService.GetByPib(firmaDto.PIB) != null)
                return BadRequest($"Firma sa PIB-om {firmaDto.PIB} vec postoji!\n");
            if (await _firmaService.GetByEmail(firmaDto.Email) != null)
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

            if (firma.Blocked)
                return Forbid();

            var token = new JwtProvider(_configuration).Generate(firma);

            Roles role = Roles.Nedefinisano;

            foreach (var claim in token.Claims)
            {
                if (claim.Type == "Role")
                    role = (Roles)Enum.Parse(typeof(Roles), claim.Value);
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
                Role = role
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

            if (firma.Blocked)
                return Forbid();

            var token = jwtProvider.Generate(firma);

            Roles role = Roles.Nedefinisano;

            foreach (var claim in token.Claims)
            {
                if (claim.Type == "Role")
                    role = (Roles)Enum.Parse(typeof(Roles), claim.Value);
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
                Role = role
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

    [HttpPut("Update/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(string id, [FromBody] Firma firma)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(firma.Email))
                return BadRequest("Format emaila pogresan");
            if (!UtilityCheck.IsValidPib(firma.PIB))
                return BadRequest("PIB mora da zadrzi 8 broja");
            if (await _firmaService.GetByPib(firma.PIB) != null)
                return BadRequest($"Firma sa PIB-om {firma.PIB} vec postoji!\n");
            if (await _firmaService.GetByEmail(firma.Email) != null)
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

    [Authorize]
    [RequiresClaim(Roles.Firma)]
    [HttpPut("UpdateSelf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateSelf(FirmaUpdateSelf firma)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;

            if (id is null)
                return Unauthorized();

            if (!UtilityCheck.IsValidEmail(firma.Email))
                return BadRequest("Format emaila pogresan");
            if (!UtilityCheck.IsValidStruke(firma.Struke))
                return BadRequest("Maksimalan broj struka za firmu je 15");

            var obj = await _firmaService.GetByEmail(firma.Email);
            if (obj != null && obj.Email != firma.Email)
                return BadRequest($"Firma sa Email-om {firma.Email} vec postoji!\n");

            var postojecaFirma = await _firmaService.GetById(id);
            if (postojecaFirma is null)
            {
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");
            }

            await _firmaService.UpdateSelf(id, firma);
            return Ok($"Firma sa ID-em {id} je uspesno azurirana!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Firma)]
    [HttpPatch("Deposit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Deposit([FromBody] double amount)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;
            if (id is null)
                return Unauthorized();

            if (amount < 2000)
                return BadRequest("Ne mozete uplatiti manje od 2000 dinara na racun\n");
            if (amount > 100000000)
                return BadRequest("Ne mozete uplatiti vise od 100000000 dinara na racun\n");

            var postojecaFirma = await _firmaService.GetById(id);
            if (postojecaFirma is null)
            {
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");
            }

            await _firmaService.UpdateMoney(id, amount);
            return Ok($"Firma sa ID-em {id} je uspesno uplatila novac!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Firma)]
    [HttpPatch("Withdraw")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status406NotAcceptable)]
    public async Task<IActionResult> Withdraw([FromBody] double amount)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;
            if (id is null)
                return Unauthorized();

            if (amount < 1000)
                return BadRequest("Ne mozete isplatiti manje od 1000\n");
            if (amount > 100000000)
                return BadRequest("Ne mozete isplatiti vise od 100000000\n");

            var postojecaFirma = await _firmaService.GetById(id);
            if (postojecaFirma is null)
            {
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");
            }

            if (postojecaFirma.NovacNaSajtu - amount < 0)
            {
                return new ObjectResult("Ne mozete skinuti vise nego sto imate na racunu")
                {
                    StatusCode = StatusCodes.Status406NotAcceptable
                };

            }

            await _firmaService.UpdateMoney(id, -amount);
            return Ok($"Firma sa ID-em {id} je uspesno podigla novac!\n");
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

    [Authorize]
    [HttpPost("Filter")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Filter(FilterFirmaDTO filter)
    {
        try
        {
            if (!UtilityCheck.IsValidQuery(filter.Query))
                return BadRequest("Duzina query-ja je prevelika ili broj reci je prevelik");
            if (!UtilityCheck.IsValidQuery(filter.Opis))
                return BadRequest("Duzina opisa je prevelika ili broj reci je prevelik");

            var filterList = await _firmaService.Filter(filter);
            if (filterList.Count == 0)
            {
                return NotFound("Ne postoji ni jedna firma sa zadatim parametrima!\n");
            }

            return Ok(filterList);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}