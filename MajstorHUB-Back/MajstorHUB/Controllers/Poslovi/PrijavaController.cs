using Amazon.Runtime.Internal.Util;
using MajstorHUB.Models.Users;
using MajstorHUB.Responses.Prijava;

namespace MajstorHUB.Controllers.Poslovi;

[ApiController]
[Route("[controller]")]
public class PrijavaController : ControllerBase
{
    private readonly IPrijavaService _prijavaService;
    private readonly IKorisnikService _korisnikService;
    private readonly IFirmaService _firmaService;
    private readonly IMajstorService _majstorService;
    private readonly IOglasService _oglasService;

    public PrijavaController(IPrijavaService prijavaService, IFirmaService firmaService, IMajstorService majstorService, IOglasService oglasService, IKorisnikService korisnikService)
    {
        _prijavaService = prijavaService;
        _firmaService = firmaService;
        _majstorService = majstorService;
        _oglasService = oglasService;
        _korisnikService = korisnikService;
    }

    private async Task<User> GetIzvodjacById(string userId, Roles userType)
    {
        switch (userType)
        {
            case Roles.Firma:
                return await _firmaService.GetById(userId);
            case Roles.Majstor:
                return await _majstorService.GetById(userId);
            default:
                throw new NotSupportedException("Tip koji je prosledjen nije podrzan!\n");
        }
    }

    private string GetIzvodjacErrorMessage(Roles userType)
    {
        switch (userType)
        {
            case Roles.Firma:
                return "Firma sa prosledjenim ID-em nije pronadjena!\n";
            case Roles.Majstor:
                return "Majstor sa prosledjenim ID-em nije pronadjen!\n";
            default:
                throw new NotSupportedException("Tip koji je prosledjen nije podrzan!\n");
        }
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
            var korisnik = await _korisnikService.GetById(id);
            if (!korisnik.OglasiId.Contains(oglasId))
                return BadRequest("Nemate pravo da gledate prijave za tudj oglas");
            var oglas = await _oglasService.GetById(oglasId);
            if (oglas is null)
                return BadRequest("Oglas sa datim id-em ne postoji");

            var prijave = await _prijavaService.GetByOglas(oglasId, oglas);
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
    [HttpPost("Prijavi-se")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status402PaymentRequired)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Post([FromBody] CreatePrijavaDTO prijava)
    {
        try
        {
            var izvodjacId = HttpContext.User.Identity?.Name;
            if (izvodjacId is null)
                return Unauthorized();

            var tipIzvodjaca = UtilityCheck.GetRole(HttpContext);

            var izvodjac = await GetIzvodjacById(izvodjacId, tipIzvodjaca);
            if (izvodjac is null)
                return NotFound(GetIzvodjacErrorMessage(tipIzvodjaca));

            if (izvodjac.NovacNaSajtu < prijava.Bid)
                return StatusCode(402, "Nemate dovoljno novca za ovaj oglas");

            if (prijava.Ponuda < 1000 || prijava.Ponuda > 100000000)
                return BadRequest("Ponuda mora da bude izmedju 1000 i 100000000 dinara");

            var oglas = await _oglasService.GetById(prijava.OglasId);
            if (oglas is null)
                return NotFound("Oglas sa prosledjenim ID-em nije pronadjen");
            if (!oglas.Active || oglas.Private)
                return BadRequest("Posao je zatvoren za prijave");

            if (izvodjac.OglasiId.Contains(oglas.Id!))
                return BadRequest("Imate pravo na samo jednu prijavu po poslu");

            // ogranici broj prijava na 30
            if (oglas.PrijaveIds.Count == 3)
                return StatusCode(409, "Maksimalan broj prijava postignut, nemate pravo da se prijavite");

            var novaPrijava = new Prijava
            {
                IzvodjacId = izvodjacId,
                OglasId = prijava.OglasId,
                Ponuda = prijava.Ponuda,
                TipIzvodjaca = tipIzvodjaca,
                Opis = prijava.Opis,
                Bid = prijava.Bid,
            };

            await _prijavaService.Create(novaPrijava);

            return Ok($"Uspesno kreirana prijava sa ID-em {novaPrijava.Id}!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Majstor, Roles.Firma)]
    [HttpDelete("DeleteSelf/{oglasId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSelf(string oglasId)
    {
        try
        {
            var izvodjacId = HttpContext.User.Identity?.Name;
            var tipIzvodjaca = UtilityCheck.GetRole(HttpContext);

            if (izvodjacId is null)
                return Unauthorized();

            var izvodjac = await GetIzvodjacById(izvodjacId, tipIzvodjaca);
            var prijaveNaPosao = izvodjac switch
            {
                Majstor majstor => majstor.PrijaveNaPosao,
                Firma firma => firma.PrijaveNaPosao,
                _ => throw new InvalidOperationException("Izvodjac mora da bude majstor ili firma")
            };

            var oglas = await _oglasService.GetById(oglasId);
            if (oglas is null)
                return NotFound("Nije pronadjen oglas");

            var prijavaId = oglas.PrijaveIds.Intersect(prijaveNaPosao).FirstOrDefault();
            if (prijavaId is null)
                return NotFound("Nismo pronasli izvodjacevu prijavu za dat oglas");

            if (!prijaveNaPosao.Contains(prijavaId))
                return BadRequest("Smete da brisete samo svoju prijavu");

            var postojecaPrijava = await _prijavaService.GetById(prijavaId);
            if (postojecaPrijava is null)
            {
                return NotFound($"Prijava sa ID-em {prijavaId} ne postoji!");
            }

            await _prijavaService.Delete(prijavaId);
            return Ok($"Prijava sa ID-em {prijavaId} je uspesno obrisana!");
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
