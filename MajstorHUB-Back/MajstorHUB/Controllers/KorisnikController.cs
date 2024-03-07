using Utlity;

namespace MajstorHUB.Controllers;

[ApiController]
[Route("[controller]")]
public class KorisnikController : ControllerBase
{
    private readonly IKorisnikService _korisnikService;

    public KorisnikController(IKorisnikService korisnikService)
    {
        this._korisnikService = korisnikService;
    }

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            var listaKorisnika = await _korisnikService.GetAll();
            if (listaKorisnika == null)
            {
                return NotFound($"Ne postoji nijedan korisnik u bazi!\n");
            }
            return Ok(listaKorisnika);
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
    public async Task<ActionResult> Get(string id)
    {
        try
        {
            var korisnik = await _korisnikService.GetById(id);
            if (korisnik == null)
            {
                //Ne stampa ovo ovde
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
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
    public async Task<ActionResult> GetByJmbg(string jmbg)
    {
        try
        {
            if (!Utility.IsValidJmbg(jmbg)) return BadRequest("JMBG mora sadrzati 13 broja!\n");

            var korisnik = await _korisnikService.GetByJmbg(jmbg);
            if (korisnik == null) return NotFound($"Korisnik sa JMBG-om {jmbg} ne postoji!\n");
            return Ok(korisnik);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByEmail/{email}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetByEmail(string email)
    {
        try
        {
            if (!Utility.IsValidEmail(email)) return BadRequest("Pogresan format email-a!");

            var korisnik = await _korisnikService.GetByEmail(email);
            if (korisnik == null) return NotFound($"Korisnik sa Email-om {email} ne postoji!\n");
            return Ok(korisnik);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Post([FromBody] Korisnik korisnik)
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

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Login(string email, string password)
    {
        try
        {
            var korisnik = await _korisnikService.GetByEmail(email);
            if (korisnik is null)
                return BadRequest("Korisnik sa zadatim Email-om ne postoji");

            var tmp = BCrypt.Net.BCrypt.Verify(password, korisnik.Password);
            return Ok(tmp);

            //generisanje tokena...
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("Update/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Put(string id, [FromBody] Korisnik korisnik)
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

    [HttpDelete("Delete/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Delete(string id)
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