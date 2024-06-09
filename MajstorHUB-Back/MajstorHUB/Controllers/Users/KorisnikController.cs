namespace MajstorHUB.Controllers.Users;

[ApiController]
[Route("[controller]")]
public class KorisnikController : ControllerBase
{
    private readonly IKorisnikService _korisnikService;
    private IConfiguration _configuration;

    public KorisnikController(IKorisnikService korisnikService, IConfiguration configuration)
    {
        _korisnikService = korisnikService;
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

            bool exists = await _korisnikService.GetByEmail(email) != null;
            return Ok(exists);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("JmbgExists/{jmbg}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PibExists(string jmbg)
    {
        try
        {
            if (!UtilityCheck.IsValidJmbg(jmbg))
                return BadRequest("JMBG mora zadrzati 13 broja");

            bool exists = await _korisnikService.GetByJmbg(jmbg) != null;
            return Ok(exists);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var korisnici = await _korisnikService.GetAll();
            if (korisnici.Count == 0)
            {
                return NotFound($"Ne postoji nijedan korisnik u bazi!\n");
            }
            return Ok(korisnici);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpGet("GetByID/{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Get(string id)
    {
        try
        {
            var ownerId = HttpContext.User.Identity?.Name;
            var korisnik = await _korisnikService.GetByIdDto(id);
            if (korisnik == null)
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            if ((korisnik.Private || korisnik.Blocked) && ownerId != korisnik.Id)
                return Forbid();

            return Ok(korisnik);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByJmbg/{jmbg}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetByJmbg(string jmbg)
    {
        try
        {
            if (!UtilityCheck.IsValidJmbg(jmbg))
                return BadRequest("JMBG mora sadrzati 13 broja!\n");
            var korisnik = await _korisnikService.GetByJmbg(jmbg);
            if (korisnik == null)
                return NotFound($"Korisnik sa JMBG-om {jmbg} ne postoji!\n");
            return Ok(korisnik);
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
            if (!UtilityCheck.IsValidEmail(email))
                return BadRequest("Pogresan format email-a!");

            var korisnik = await _korisnikService.GetByEmail(email);
            if (korisnik == null)
                return NotFound($"Korisnik sa Email-om {email} ne postoji!\n");
            return Ok(korisnik);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(RegisterKorisnikDTO korisnikDto)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(korisnikDto.Email))
                return BadRequest("Format emaila pogresan");
            if (!UtilityCheck.IsValidJmbg(korisnikDto.JMBG))
                return BadRequest("JMBG mora da zadrzi 13 broja");
            if (await _korisnikService.GetByJmbg(korisnikDto.JMBG) != null)
                return BadRequest($"Korisnik sa JMBG-om {korisnikDto.JMBG} vec postoji!\n");
            if (await _korisnikService.GetByEmail(korisnikDto.Email) != null)
                return BadRequest($"Korisnik sa Email-om {korisnikDto.Email} vec postoji!\n");

            var korisnik = new Korisnik
            {
                Ime = korisnikDto.Ime,
                Prezime = korisnikDto.Prezime,
                Email = korisnikDto.Email,
                JMBG = korisnikDto.JMBG,
                Password = korisnikDto.Sifra,
            };

            korisnik.Password = BCrypt.Net.BCrypt.HashPassword(korisnik.Password);

            await _korisnikService.Create(korisnik);
            return Ok($"Dodat je korisnik sa ID-em {korisnik.Id}!\n");
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
                return BadRequest("Pogresna format email-a!");

            var korisnik = await _korisnikService.GetByEmail(email);
            if (korisnik is null)
                return BadRequest("Korisnik sa zadatim Email-om ne postoji!\n");

            var hashPassword = BCrypt.Net.BCrypt.Verify(password, korisnik.Password);

            if (!hashPassword)
            {
                return Unauthorized("Pogresna sifra!\n");
            }

            if (korisnik.Blocked)
                return Forbid();

            var token = new JwtProvider(_configuration).Generate(korisnik);

            Roles role = Roles.Nedefinisano;
            AdminRoles admin = AdminRoles.Nedefinisano;

            foreach (var claim in token.Claims)
            {
                if (claim.Type == "Role")
                    role = (Roles)Enum.Parse(typeof(Roles), claim.Value);
                if (claim.Type == "Admin")
                    admin = (AdminRoles)Enum.Parse(typeof(AdminRoles), claim.Value);
            }

            var refresh = new RefreshToken
            {
                TokenValue = RefreshProvider.GenerateRefreshToken(),
                Expiry = DateTime.UtcNow.Add(new JwtOptions(_configuration).RefreshTokenLifetime),
                JwtId = token.Id
            };

            await _korisnikService.UpdateRefreshToken(korisnik.Id!, refresh);

            return Ok(new LoginResponse
            {
                Naziv = korisnik.Ime + ' ' + korisnik.Prezime,
                UserId = korisnik.Id!,
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                RefreshToken = refresh,
                Role = role,
                Admin = admin
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
                return Unauthorized("Nemas token"); // ne prikazuje se greska korisniku zasto nije autorizovan iz bezbednosnih razloga

            // Provera datuma access tokena, malo je komplikovano jer se datum isteka tokena pamti kao
            // sekude od datuma 01.01.1970 00:00:00
            JwtOptions options = new JwtOptions(_configuration);
            var expiryDateUnix =
                long.Parse(principal.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
            var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                .AddSeconds(expiryDateUnix);

            if (expiryDateTimeUtc > DateTime.UtcNow)
                return Unauthorized("Refresh token jos nije istekao");

            var korisnik = await _korisnikService.GetById(principal.Identity.Name);
            var jwtId = principal.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            if (korisnik is null)
                return Unauthorized("Ne mozemo da nadjemo korisnika sa tim id-em u bazi");
            if (korisnik.RefreshToken?.JwtId != jwtId)
                return Unauthorized("Refresh token nije vezan za taj JWT");
            if (korisnik.RefreshToken.TokenValue != model.RefreshToken)
                return Unauthorized("Refresh token se ne poklapa sa onim u bazi");
            if (korisnik.RefreshToken.Expiry < DateTime.UtcNow)
                return Unauthorized("Refresh token je istekao, ne smes ovaj endpoint da zoves tako");

            if (korisnik.Blocked)
                return Forbid();

            var token = new JwtProvider(_configuration).Generate(korisnik);

            Roles role = Roles.Nedefinisano;
            AdminRoles admin = AdminRoles.Nedefinisano;

            foreach (var claim in token.Claims)
            {
                if (claim.Type == "Role")
                    role = (Roles)Enum.Parse(typeof(Roles), claim.Value);
                if (claim.Type == "Admin")
                    admin = (AdminRoles)Enum.Parse(typeof(AdminRoles), claim.Value);
            }

            var refresh = new RefreshToken
            {
                TokenValue = RefreshProvider.GenerateRefreshToken(),
                Expiry = DateTime.UtcNow.Add(new JwtOptions(_configuration).RefreshTokenLifetime),
                JwtId = token.Id
            };

            await _korisnikService.UpdateRefreshToken(korisnik.Id!, refresh);

            return Ok(new LoginResponse
            {
                Naziv = korisnik.Ime + ' ' + korisnik.Prezime,
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refresh,
                Expiration = token.ValidTo,
                Role = role,
                Admin = admin,
                UserId = korisnik.Id!
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
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

            var firma = await _korisnikService.GetById(id);

            if (firma is null)
                return Unauthorized();

            await _korisnikService.DeleteRefreshToken(firma.Id!);

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
    public async Task<IActionResult> Put(string id, [FromBody] Korisnik korisnik)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(korisnik.Email))
                return BadRequest("Format emaila pogresan");
            if (!UtilityCheck.IsValidJmbg(korisnik.JMBG))
                return BadRequest("JMBG mora da zadrzi 13 broja");
            if (await _korisnikService.GetByJmbg(korisnik.JMBG) != null)
                return BadRequest($"Korisnik sa JMBG-om {korisnik.JMBG} vec postoji!\n");
            var obj = await _korisnikService.GetByEmail(korisnik.Email);
            if (obj != null && obj.Email != korisnik.Email)
                return BadRequest($"Korisnik sa Email-om {korisnik.Email} vec postoji!\n");

            var postojeciKorisnik = await _korisnikService.GetById(id);
            if (postojeciKorisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
            await _korisnikService.Update(id, korisnik);
            return Ok($"Korisnik sa ID-em {id} je uspesno azuriran!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpPut("UpdateSelf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateSelf(KorisnikUpdateSelf korisnik)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;

            if (id is null)
                return Unauthorized();

            if (!UtilityCheck.IsValidEmail(korisnik.Email))
                return BadRequest("Format emaila pogresan");

            var obj = await _korisnikService.GetByEmail(korisnik.Email);
            if (obj != null && obj.Email != korisnik.Email)
                return BadRequest($"Korisnik sa Email-om {korisnik.Email} vec postoji!\n");

            var postojeciKorisnik = await _korisnikService.GetById(id);
            if (postojeciKorisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }

            await _korisnikService.UpdateSelf(id, korisnik);
            return Ok($"Korisnik sa ID-em {id} je uspesno azuriran!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
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

            var postojecaFirma = await _korisnikService.GetById(id);
            if (postojecaFirma is null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }

            await _korisnikService.UpdateMoney(id, amount);
            return Ok($"Korisnik sa ID-em {id} je uspesno uplatio novac!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpPatch("Withdraw")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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

            var postojecaFirma = await _korisnikService.GetById(id);
            if (postojecaFirma is null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }

            if (postojecaFirma.NovacNaSajtu - amount < 0)
            {
                return new ObjectResult("Ne mozete skinuti vise nego sto imate na racunu")
                {
                    StatusCode = StatusCodes.Status406NotAcceptable
                };
            }

            await _korisnikService.UpdateMoney(id, -amount);
            return Ok($"Korisnik sa ID-em {id} je uspesno podigao novac!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpDelete("Delete/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var postojeciKorisnik = await _korisnikService.GetById(id);
            if (postojeciKorisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }

            await _korisnikService.Delete(id);
            return Ok($"Korisnik sa ID-em {id} je uspesno obrisan!\n");
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
    public async Task<IActionResult> Filter(FilterKorisnikDto filter)
    {
        try
        {
            if (!UtilityCheck.IsValidQuery(filter.Query))
                return BadRequest("Duzina query-ja je prevelika ili broj reci je prevelik");
            if (!UtilityCheck.IsValidQuery(filter.Opis))
                return BadRequest("Duzina opisa je prevelika ili broj reci je prevelik");

            var filterList = await _korisnikService.Filter(filter);
            if (filterList.Count == 0)
            {
                return NotFound("Ne postoji ni jedan korisnik sa zadatim parametrima\n");
            }

            return Ok(filterList);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}