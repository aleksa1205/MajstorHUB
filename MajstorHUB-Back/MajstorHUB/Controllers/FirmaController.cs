namespace MajstorHUB.Controllers;

[ApiController]
[Route("[controller]")]
public class FirmaController : ControllerBase
{
    private readonly IFirmaService _firmaService;

    public FirmaController(IFirmaService firmeService)
    {
        this._firmaService = firmeService;
    }

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            var firme = await _firmaService.GetAll();
            if (firme == null)
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
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Get(string id)
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
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetByPib(string pib)
    {
        try
        {
            if (!UtilityCheck.IsValidPib(pib)) return BadRequest("Pib mora sadrzati 8 broja!\n");

            var firma = await _firmaService.GetByPib(pib);
            if (firma == null)
                return NotFound($"Firma sa PIB-om {pib} ne postoji!\n");
            return Ok(firma);
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
            if (!UtilityCheck.IsValidEmail(email)) return BadRequest("\"Pogresan format email-a!\n");

            var firma = await _firmaService.GetByEmail(email);
            if (firma is null)
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
    public async Task<ActionResult> Post([FromBody] Firma firma)
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

    // Mora da bude post jer ce da generise token kasnije
    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Login(string email, string password)
    {
        try
        {
            var firma = await _firmaService.GetByEmail(email);
            if (firma == null)
                return BadRequest("Firma sa zadatim Email-om ne postoji");

            var tmp = BCrypt.Net.BCrypt.Verify(password, firma.Password);
            return Ok(tmp);

            //generisanje tokena...
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    //dodat await kod update
    [HttpPut("Update/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Put(String id, [FromBody] Firma firma)
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

    //dodati sa await kod delete
    [HttpDelete("Delete/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(string id)
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