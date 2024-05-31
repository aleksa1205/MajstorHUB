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
            var korisnik = await _korisnikService.GetById(oglas.KorisnikId);
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

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpPost("Postavi")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PostaviOglas(CreateOglasDTO oglasDto)
    {
        try
        {
            var korisnikId = HttpContext.User.Identity?.Name;
            if (korisnikId is null)
                return BadRequest("Nemate ID u tokenu");

            var korisnik = await _korisnikService.GetById(korisnikId);
            if (korisnik is null)
                return NotFound($"Korisnik sa ID-em {korisnikId} ne postoji");

            if (oglasDto.Iskustvo == Iskustvo.Nedefinisano)
                return BadRequest("Iskustvo ne moze da bude nedefinisano");

            if (oglasDto.DuzinaPosla == DuzinaPosla.Nedefinisano)
                return BadRequest("Duzina posla ne moze da bude nedefinisana");

            if (oglasDto.Struke.Count == 0)
                return BadRequest("Lista struka ne moze da bude prazna");

            if (oglasDto.Cena < 1000 || oglasDto.Cena > 1000000)
                return BadRequest("Cena oglasa mora da bude izmedju 1000 i 1000000 dinara");

            var oglas = new Oglas
            {
                Cena = oglasDto.Cena,
                KorisnikId = korisnikId,
                Naslov = oglasDto.Naslov,
                Opis = oglasDto.Opis,
                DuzinaPosla = oglasDto.DuzinaPosla,
                Iskustvo = oglasDto.Iskustvo,
                Lokacija = oglasDto.Lokacija,
                Struke = oglasDto.Struke
            };

            await _oglasService.Create(oglas);

            korisnik.OglasiId.Add(oglas.Id!);
            await _korisnikService.Update(korisnikId, korisnik);

            return Ok($"Oglas sa ID-em {oglas.Id} uspesno dodat!\n");

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpPatch("UpdateSelf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateSelf(OglasUpdateSelf oglas)
    {
        try
        {
            var id = HttpContext.User.Identity?.Name;
            if (id is null)
                return Unauthorized();
            var korisnik = await _korisnikService.GetById(id);
            if(korisnik is null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!");
            }
            if (!korisnik.OglasiId.Contains(oglas.Id))
            {
                return Unauthorized();
            }
            var postojeciOglas = await _oglasService.GetById(oglas.Id);
            if(postojeciOglas is null)
            {
                return NotFound($"Oglas sa ID-em {oglas.Id} ne postoji!\n");
            }
            await _oglasService.UpdateSelf(oglas);
            return Ok($"Oglas sa ID-em {oglas.Id} je uspesno azuriran!\n");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
