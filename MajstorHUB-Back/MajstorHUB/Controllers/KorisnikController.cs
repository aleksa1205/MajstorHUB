﻿using MajstorHUB.Models;
using System.Runtime.Intrinsics.X86;

namespace MajstorHUB.Controllers;

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

    [HttpGet("GetByID/{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get(string id)
    {
        try
        {
            var korisnik = await _korisnikService.GetById(id);
            if (korisnik == null)
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
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
    public async Task<IActionResult> Register([FromBody] Korisnik korisnik)
    {
        try
        {
            korisnik.Password = BCrypt.Net.BCrypt.HashPassword(korisnik.Password);

            if ((await _korisnikService.GetByJmbg(korisnik.JMBG)) != null)
                return BadRequest($"Korisnik sa JMBG-om {korisnik.JMBG} vec postoji!\n");
            if ((await _korisnikService.GetByEmail(korisnik.Email)) != null)
                return BadRequest($"Korisnik sa Email-om {korisnik.Email} vec postoji!\n");

            await _korisnikService.Create(korisnik);
            return Ok($"Dodat je korisnik sa ID-em {korisnik.Id}!\n");
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
            if (!UtilityCheck.IsValidEmail(email))
                return BadRequest("Pogresna format email-a!");

            var korisnik = await _korisnikService.GetByEmail(email);
            if (korisnik is null)
                return BadRequest("Korisnik sa zadatim Email-om ne postoji!\n");

            var hashPassword = BCrypt.Net.BCrypt.Verify(password, korisnik.Password);

            if (!hashPassword)
            {
                return BadRequest("Pogresna sifra!\n");
            }

            var token = new JwtProvider(_configuration).Generate(korisnik);

            var refresh = new RefreshToken
            {
                TokenValue = RefreshProvider.GenerateRefreshToken(),
                Expiry = DateTime.UtcNow.Add(new JwtOptions(_configuration).RefreshTokenLifetime),
                JwtId = token.Id
            };

            await _korisnikService.UpdateRefreshToken(korisnik.Id!, refresh);

            return Ok(new LoginResponse
            {
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                RefreshToken = refresh
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
                return Unauthorized(); // ne prikazuje se greska korisniku zasto nije autorizovan zbog bezbednosnih razloga

            // Provera datuma access tokena, malo je komplikovano jer se datum isteka tokena pamti kao
            // sekude od datuma 01.01.1970 00:00:00
            JwtOptions options = new JwtOptions(_configuration);
            var expiryDateUnix =
                long.Parse(principal.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
            var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                .AddSeconds(expiryDateUnix);

            if (expiryDateTimeUtc > DateTime.UtcNow)
                return Unauthorized();

            var korisnik = await _korisnikService.GetById(principal.Identity.Name);
            var jwtId = principal.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            if (korisnik is null ||
                korisnik.RefreshToken?.JwtId != jwtId ||
                korisnik.RefreshToken.TokenValue != model.RefreshToken ||
                korisnik.RefreshToken.Expiry < DateTime.UtcNow
                )
                    return Unauthorized();

            var token = new JwtProvider(_configuration).Generate(korisnik);

            var refresh = new RefreshToken
            {
                TokenValue = RefreshProvider.GenerateRefreshToken(),
                Expiry = DateTime.UtcNow.Add(new JwtOptions(_configuration).RefreshTokenLifetime),
                JwtId = token.Id
            };

            await _korisnikService.UpdateRefreshToken(korisnik.Id!, refresh);

            return Ok(new LoginResponse
            {
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refresh,
                Expiration = token.ValidTo
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

    [HttpPost("Prosek/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Average(string id)
    {
        try
        {
            var korisnik = await _korisnikService.GetById(id);
            if (korisnik is null)
                return NotFound($"Korisnik za ID-em {id} ne postoji!\n");
            if (korisnik.Recenzija.Count == 0)
                return BadRequest("Korisnik nema nijednu recenziju!\n");
            double avg = 0;
            foreach(var element in korisnik.Recenzija)
                avg += element.Ocena;
            avg /= korisnik.Recenzija.Count;
            return Ok(avg);
        }
        catch(Exception e)
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
            if ((await _korisnikService.GetByJmbg(korisnik.JMBG)) != null)
                return BadRequest($"Korisnik sa JMBG-om {korisnik.JMBG} vec postoji!\n");
            if ((await _korisnikService.GetByEmail(korisnik.Email)) != null)
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
}