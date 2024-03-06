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
            var postojeciMajstor =  await _majstorService.GetById(id);
            if (postojeciMajstor == null)
            {
                return NotFound($"Majstor sa ID-em {id} ne postoji!\n");
            }
            return Ok(postojeciMajstor);
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
            if (jmbg.Length != 13 || !jmbg.All(Char.IsNumber)) return BadRequest("JMBG mora da sadrzi 13 broja.\n");
            var postojeciMajstor = await _majstorService.GetByJmbg(jmbg);
            if (postojeciMajstor == null) 
            {
                return NotFound($"Majstor sa JMBG-om {jmbg} ne postoji!\n");
            }
            return Ok(postojeciMajstor);
        }
        catch(Exception ex)
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
            await _majstorService.Create(majstor);
            return Ok($"Uspesno dodat majstor sa ID-em {majstor.Id}!\n");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
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
            var postojecaFirma = await _majstorService.GetById(id);
            if (postojecaFirma == null)
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
