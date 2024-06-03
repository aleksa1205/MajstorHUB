namespace MajstorHUB.Controllers.Poslovi;

[ApiController]
[Route("[controller]")]
public class PrijavaController : ControllerBase
{
    private readonly IPrijavaService _prijavaService;
    private readonly IFirmaService _firmaService;
    private readonly IMajstorService _majstorService;
    private readonly IOglasService _oglasService;

    public PrijavaController(IPrijavaService prijavaService, IFirmaService firmaService, IMajstorService majstorService, IOglasService oglasService)
    {
        _prijavaService = prijavaService;
        _firmaService = firmaService;
        _majstorService = majstorService;
        _oglasService = oglasService;
    }

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var prijave = await _prijavaService.GetAll();
            if (prijave.Count == 0)
                return NotFound("Ne postoji nijedna prijava!");
            return Ok(prijave);
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
    public async Task<IActionResult> GetByID(string id)
    {
        try
        {
            var prijava = await _prijavaService.GetById(id);
            if (prijava is null)
                return NotFound($"Prijava sa ID-em {id} ne postoji!");
            return Ok(prijava);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpGet("GetByOglas/{oglasId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByOglas(string oglasId)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;
            if (id is null)
                return Unauthorized();
            var prijave = await _prijavaService.GetByOglas(oglasId);
            if (prijave.Count == 0)
                return NotFound($"Ne postoji nijedna prijava za oglas sa ID-em {oglasId}");
            return Ok(prijave);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Firma, Roles.Majstor)]
    [HttpPost("Post")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Post(CreatePrijavaDTO prijavaDTO)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;
            if (id is null)
                return Unauthorized();
            Firma firma = await _firmaService.GetById(prijavaDTO.Izvodjac);
            Majstor majstor = await _majstorService.GetById(prijavaDTO.Izvodjac);
            if (firma is null && majstor is null)
            {
                return NotFound($"Izvodjac radova sa ID-em {prijavaDTO.Izvodjac} nije pronađen!");
            }
            Oglas oglas = await _oglasService.GetById(prijavaDTO.Oglas);
            if (oglas is null)
            {
                return NotFound($"Oglas sa ID-em {prijavaDTO.Oglas} nije pronađen!");
            }

            Prijava prijava = new Prijava
            {
                Izvodjac = prijavaDTO.Izvodjac,
                TipIzvodjaca = firma is not null ? Roles.Firma : Roles.Majstor,
                Oglas = prijavaDTO.Oglas,
                Ponuda = prijavaDTO.Ponuda,
                Opis = prijavaDTO.Opis
            };
            await _prijavaService.Create(prijava);
            return Ok($"Uspesno kreirana prijava sa ID-em {prijava.Id}!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpDelete("Delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var postojecaPrijava = await _prijavaService.GetById(id);
            if (postojecaPrijava is null)
            {
                return NotFound($"Prijava sa ID-em {id} ne postoji!");
            }
            await _prijavaService.Delete(id);
            return Ok($"Prijava sa ID-em {id} je uspesno obrisana!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
