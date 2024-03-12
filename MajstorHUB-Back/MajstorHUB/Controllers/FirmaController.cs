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

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetAll()
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
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetByPib(string pib)
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
    public async Task<ActionResult> GetByEmail(string email)
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

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Login(string email, string password)
    {
        try
        {
            var firma = await _firmaService.GetByEmail(email);
            if (firma == null)
                return BadRequest("Firma sa zadatim Email-om ne postoji!\n");

            var hashPassword = BCrypt.Net.BCrypt.Verify(password, firma.Password);
            if (hashPassword)
            {
                var token = new JwtProvider(_configuration).Generate(firma);
                return Ok(token);
            }
            else
            {
                return BadRequest("Pogresna sifra!\n");
            }
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