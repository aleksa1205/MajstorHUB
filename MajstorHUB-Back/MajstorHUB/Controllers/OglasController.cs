using MongoDB.Driver.Core.Authentication;
using System.Linq.Expressions;

namespace MajstorHUB.Controllers;

[ApiController]
[Route("[controller]")]
public class OglasController : ControllerBase
{
    private readonly IOglasService _oglasService;
    private readonly IKorisnikService _korisnikService;

    public OglasController(IOglasService oglasService, IKorisnikService korisnikService)
    {
        _oglasService = oglasService;
        _korisnikService = korisnikService;
    }

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var oglasi = await _oglasService.GetAll();
            if (oglasi.Count == 0)
                return NotFound("Ne postoji nijedan oglas u bazi!\n");
            return Ok(oglasi);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetById/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var oglas = await _oglasService.GetById(id);
            if (oglas == null)
                return NotFound($"Oglas sa ID-em {id} ne postoji!\n");
            return Ok(oglas);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetByUser/{korisnikiId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByUser(string korisnikId)
    {
        try
        {
            var korisnik = await _korisnikService.GetById(korisnikId);
            if (korisnik is null)
                return NotFound($"Korisnik sa ID-em {korisnikId} ne postoji!\n");
            var oglasi = await _oglasService.GetByKorisnik(korisnikId);
            if (oglasi is null)
                return NotFound($"Zadati korisnik nema nijedan postavljen oglas!\n");
            return Ok(oglasi);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Post([FromBody] Oglas oglas)
    {
        try
        {
            var korisnik = _korisnikService.GetById(oglas.KorisnikId);
            if (korisnik is null)
                return NotFound($"Korisnik sa ID-em {oglas.KorisnikId} ne postoji!\n");
            await _oglasService.Create(oglas);
            return Ok($"Oglas sa ID-em {oglas.Id} uspesno dodat!\n");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Put(string id, [FromBody] Oglas oglas)
    {
        try
        {
            var postojeciOglas = await _oglasService.GetById(id);
            if (postojeciOglas is null)
                return NotFound($"Oglas sa ID-em {id} ne postoji!\n");
            await _oglasService.Update(id, oglas);
            return Ok($"Oglas sa ID-em {id} je uspesno azuziran!\n");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);  
        }
    }

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var postojeciOglas = await _oglasService.GetById(id);
            if (postojeciOglas is null)
                return NotFound($"Oglas sa ID-em {id} ne postoji!\n");
            await _oglasService.Delete(id);
            return Ok($"Oglas sa ID-em {id} je uspesno obrisan!\n");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
