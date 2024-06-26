﻿namespace MajstorHUB.Controllers.Users;

[ApiController]
[Route("[controller]")]
public class MajstorController : ControllerBase
{
    private readonly IMajstorService _majstorService;
    private IConfiguration _configuration;

    public MajstorController(IMajstorService majstorService, IConfiguration configuration)
    {
        _majstorService = majstorService;
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

            bool exists = await _majstorService.GetByEmail(email) != null;
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

            bool exists = await _majstorService.GetByJmbg(jmbg) != null;
            return Ok(exists);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var majstori = await _majstorService.GetAll();
            if (majstori.Count == 0)
            {
                return NotFound("Nijedan majstor ne postoji u bazi!\n");
            }
            return Ok(majstori);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetByID/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var ownerid = HttpContext.User.Identity?.Name;
            var majstor = await _majstorService.GetByIdDto(id);
            if (majstor == null)
            {
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");
            }
            if ((majstor.Blocked || majstor.Private) && ownerid != majstor.Id)
                return Forbid();

            return Ok(majstor);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetByJmbg/{jmbg}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByJmbg(string jmbg)
    {
        try
        {
            if (UtilityCheck.IsValidJmbg(jmbg))
                return BadRequest("JMBG mora da sadrzi 13 broja.\n");
            var majstor = await _majstorService.GetByJmbg(jmbg);
            if (majstor == null)
                return NotFound($"Majstor sa JMBG-om {jmbg} ne postoji!\n");
            return Ok(majstor);
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
                return BadRequest("Pogresan format email-a!\n");

            var majstor = await _majstorService.GetByEmail(email);
            if (majstor == null)
                return NotFound($"Majstor sa Email-om {email} ne postoji!\n");
            return Ok(majstor);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(RegisterMajstorDTO majstorDto)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(majstorDto.Email))
                return BadRequest("Format emaila pogresan");
            if (!UtilityCheck.IsValidJmbg(majstorDto.JMBG))
                return BadRequest("JMBG mora da zadrzi 13 broja");
            if (await _majstorService.GetByJmbg(majstorDto.JMBG) != null)
                return BadRequest($"Majstor sa JMBG-om {majstorDto.JMBG} vec postoji!\n");
            if (await _majstorService.GetByEmail(majstorDto.Email) != null)
                return BadRequest($"Majstor sa Email-om {majstorDto.Email} vec postoji!\n");

            var majstor = new Majstor
            {
                Ime = majstorDto.Ime,
                Prezime = majstorDto.Prezime,
                Email = majstorDto.Email,
                JMBG = majstorDto.JMBG,
                Password = majstorDto.Sifra
            };

            majstor.Password = BCrypt.Net.BCrypt.HashPassword(majstor.Password);

            await _majstorService.Create(majstor);
            return Ok($"Uspesno dodat majstor sa ID-em {majstor.Id}!\n");
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

            var majstor = await _majstorService.GetByEmail(email);
            if (majstor is null)
                return BadRequest("Majstor sa zadatim Email-om ne postoji");

            var hashPassword = BCrypt.Net.BCrypt.Verify(password, majstor.Password);

            if (!hashPassword)
            {
                return Unauthorized("Pogresna sifra!\n");
            }

            if (majstor.Blocked)
                return Forbid();

            var token = new JwtProvider(_configuration).Generate(majstor);

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

            await _majstorService.UpdateRefreshToken(majstor.Id!, refresh);

            return Ok(new LoginResponse
            {
                Naziv = majstor.Ime + ' ' + majstor.Prezime,
                UserId = majstor.Id!,
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

            var majstor = await _majstorService.GetById(principal.Identity.Name);
            var jwtId = principal.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            if (majstor is null ||
                majstor.RefreshToken?.JwtId != jwtId ||
                majstor.RefreshToken.TokenValue != model.RefreshToken ||
                majstor.RefreshToken.Expiry < DateTime.UtcNow
                )
                return Unauthorized();

            if (majstor.Blocked)
                return Forbid();

            var token = jwtProvider.Generate(majstor);

            Roles role = Roles.Nedefinisano;
            AdminRoles admin = AdminRoles.Nedefinisano;

            foreach (var claim in token.Claims)
            {
                if (claim.Type == "Role")
                    role = (Roles)Enum.Parse(typeof(Roles), claim.Value);
                if (claim.Type == "Admin")
                    admin = (AdminRoles)Enum.Parse(typeof(AdminRoles), claim.Value);
            }

            var newRefreshToken = new RefreshToken
            {
                TokenValue = RefreshProvider.GenerateRefreshToken(),
                Expiry = DateTime.UtcNow.Add(new JwtOptions(_configuration).RefreshTokenLifetime),
                JwtId = token.Id
            };
            await _majstorService.UpdateRefreshToken(majstor.Id!, newRefreshToken);


            return Ok(new LoginResponse
            {
                Naziv = majstor.Ime + ' ' + majstor.Prezime,
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = newRefreshToken,
                Expiration = token.ValidTo,
                Role = role,
                Admin = admin,
                UserId = majstor.Id!
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Majstor)]
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

            var firma = await _majstorService.GetById(id);

            if (firma is null)
                return Unauthorized();

            await _majstorService.DeleteRefreshToken(firma.Id!);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpPut("Update/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(string id, [FromBody] Majstor majstor)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(majstor.Email))
                return BadRequest("Format emaila pogresan");
            if (!UtilityCheck.IsValidJmbg(majstor.JMBG))
                return BadRequest("JMBG mora da zadrzi 13 broja");
            if (await _majstorService.GetByJmbg(majstor.JMBG) != null)
                return BadRequest($"Majstor sa JMBG-om {majstor.JMBG} vec postoji!\n");
            if (await _majstorService.GetByEmail(majstor.Email) != null)
                return BadRequest($"Majstor sa Email-om {majstor.Email} vec postoji!\n");

            var postojeciMajstor = await _majstorService.GetById(id);
            if (postojeciMajstor == null)
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");

            await _majstorService.Update(id, majstor);
            return Ok($"Majstor sa ID-em {id} je uspesno azuriran!\n");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Majstor)]
    [HttpPut("UpdateSelf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateSelf(MajstorUpdateSelf majstor)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;

            if (id is null)
                return Unauthorized();

            Console.WriteLine(majstor.Iskustvo);

            if (!UtilityCheck.IsValidEmail(majstor.Email))
                return BadRequest("Format emaila pogresan");

            var obj = await _majstorService.GetByEmail(majstor.Email);
            if (obj != null && obj.Email != majstor.Email)
                return BadRequest($"Majstor sa Email-om {majstor.Email} vec postoji!\n");

            var postojeciMajstor = await _majstorService.GetById(id);
            if (postojeciMajstor is null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }

            await _majstorService.UpdateSelf(id, majstor);
            return Ok($"Majstor sa ID-em {id} je uspesno azuriran!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Majstor)]
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

            var postojecaFirma = await _majstorService.GetById(id);
            if (postojecaFirma is null)
            {
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");
            }

            await _majstorService.UpdateMoney(id, amount);
            return Ok($"Majstor sa ID-em {id} je uspesno uplatio novac!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Majstor)]
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

            var postojecaFirma = await _majstorService.GetById(id);
            if (postojecaFirma is null)
            {
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");
            }

            if (postojecaFirma.NovacNaSajtu - amount < 0)
            {
                return new ObjectResult("Ne mozete skinuti vise nego sto imate na racunu")
                {
                    StatusCode = StatusCodes.Status406NotAcceptable
                };
            }

            await _majstorService.UpdateMoney(id, -amount);
            return Ok($"Majstor sa ID-em {id} je uspesno podigao novac!\n");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpDelete("Delete/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var postojecaFirma = await _majstorService.GetById(id);
            if (postojecaFirma == null)
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");

            await _majstorService.Delete(id);
            return Ok($"Majstor sa ID-em {id} je uspesno obrisan!\n");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPost("Filter")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Filter(FIlterMajstorDTO filter)
    {
        try
        {
            if (!UtilityCheck.IsValidQuery(filter.Query))
                return BadRequest("Duzina query-ja je prevelika ili broj reci je prevelik");
            if (!UtilityCheck.IsValidQuery(filter.Opis))
                return BadRequest("Duzina opisa je prevelika ili broj reci je prevelik");

            var filterList = await _majstorService.Filter(filter);
            if (filterList.Count == 0)
            {
                return NotFound("Ne postoji ni jedan majstor sa zadatim parametrima!\n");
            }

            return Ok(filterList);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
