using Utlity;

namespace MajstorHUB.Controllers;

[ApiController]
[Route("[controller]")]
public class MajstorController : ControllerBase
{
    private readonly IMajstorService _majstorService;

    public MajstorController(IMajstorService majstorService)
    {
        this._majstorService = majstorService;
    }

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            var listaMajstora= await _majstorService.GetAll();
            if (listaMajstora == null)
            {
                return NotFound("Nijedan majstor ne postoji u bazi!\n");
            }
            return Ok(listaMajstora);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetByID/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetById(string id)
    {
        try
        {
            var majstor =  await _majstorService.GetById(id);
            if (majstor == null)
            {
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");
            }
            return Ok(majstor);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetByJmbg/{jmbg}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetByJmbg(string jmbg)
    {
        try
        {
            if(UtilityCheck.IsValidJmbg(jmbg)) return BadRequest("JMBG mora da sadrzi 13 broja.\n");
            var majstor = await _majstorService.GetByJmbg(jmbg);
            if (majstor == null) 
            {
                return NotFound($"Majstor sa JMBG-om {jmbg} ne postoji!\n");
            }
            return Ok(majstor);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetByEmail/{email}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetByEmail(string email)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(email)) return BadRequest("Pogresan format email-a!\n");

            var majstor = await _majstorService.GetByEmail(email);
            if (majstor == null)
            {
                return NotFound($"Majstor sa Email-om {email} ne postoji!\n");
            }
            return Ok(majstor);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Post([FromBody] Majstor majstor)
    {
        try
        {
            majstor.Password = BCrypt.Net.BCrypt.HashPassword(majstor.Password);

            if ((await _majstorService.GetByJmbg(majstor.JMBG)) != null)
                return BadRequest($"Majstor sa JMBG-om {majstor.JMBG} vec postoji!\n");
            if ((await _majstorService.GetByEmail(majstor.Email)) != null)
                return BadRequest($"Majstor sa Email-om {majstor.Email} vec postoji!\n");

            await _majstorService.Create(majstor);
            return Ok($"Uspesno dodat majstor sa ID-em {majstor.Id}!\n");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Login(string email, string password)
    {
        try
        {
            var majstor = await _majstorService.GetByEmail(email);
            if (majstor is null)
                return BadRequest("Majstor sa zadatim Email-om ne postoji");

            var tmp = BCrypt.Net.BCrypt.Verify(password, majstor.Password);
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
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Put(string id, [FromBody] Majstor majstor)
    {
        try
        {
            if ((await _majstorService.GetByJmbg(majstor.JMBG)) != null)
                return BadRequest($"Majstor sa JMBG-om {majstor.JMBG} vec postoji!\n");
            if ((await _majstorService.GetByEmail(majstor.Email)) != null)
                return BadRequest($"Majstor sa Email-om {majstor.Email} vec postoji!\n");

            var postojeciMajstor = await _majstorService.GetById(id);
            if (postojeciMajstor == null)
            {
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");
            }
            await _majstorService.Update(id, majstor);
            return Ok($"Majstor sa ID-em {id} je uspesno azuriran!\n");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("Delete/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(string id)
    {
        try
        {
            var postojecaFirma = await _majstorService.GetById(id);
            if (postojecaFirma == null)
            {
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");
            }
            await _majstorService.Delete(id);
            return Ok($"Majstor sa ID-em {id} je uspesno obrisana!\n");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
