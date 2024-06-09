namespace MajstorHUB.Controllers.Poslovi;

[ApiController]
[Route("[controller]")]
public class PosaoController : ControllerBase
{
    private readonly IPosaoService _posaoService;
    private readonly IKorisnikService _korisnikService;
    private readonly IFirmaService _firmaService;
    private readonly IMajstorService _majstorService;
    private readonly IOglasService _oglasService;
    private readonly IPrijavaService _prijavaService;
    private IConfiguration _configuration;

    public PosaoController(IPosaoService posaoService, IKorisnikService korisnikService, IFirmaService firmaService, IMajstorService majstorService, IOglasService oglasService, IPrijavaService prijavaService, IConfiguration configuration)
    {
        _posaoService = posaoService;
        _korisnikService = korisnikService;
        _firmaService = firmaService;
        _majstorService = majstorService;
        _oglasService = oglasService;
        _prijavaService = prijavaService;
        _configuration = configuration;
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
            var poslovi = await _posaoService.GetAll();
            if (poslovi.Count == 0)
            {
                return NotFound("Ne postoji nijedan posao!");
            }
            return Ok(poslovi);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpGet("GetByUserZapoceti")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByUserZapoceti()
    {
        try
        {
            var ownerId = HttpContext.User.Identity?.Name;
            var userType = UtilityCheck.GetRole(HttpContext);
            var lista = await _posaoService.GetByUserZapoceti(ownerId!, userType);
            if (lista.Count == 0)
                return NotFound("Nema poslova za datog user-a");
            return Ok(lista);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpGet("GetByUserZavrseni/{id}/{userType}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByUserZavrseni(string id, Roles userType)
    {
        try
        {
            var lista = await _posaoService.GetByUserZavrseni(id, userType);
            if (lista.Count == 0)
                return NotFound("Nema poslova za datog user-a");
            return Ok(lista);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpPost("Zapocni-posao")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status402PaymentRequired)]
    public async Task<IActionResult> Post(CreatePosaoDTO posaoDTO)
    {
        try
        {
            Korisnik korisnik = await _korisnikService.GetById(posaoDTO.Korisnik);
            if (korisnik is null)
                return NotFound($"Korisnik sa ID-em {posaoDTO.Korisnik} nije pronađen!");

            if ((await _posaoService.GetByOglas(posaoDTO.Oglas)) is not null)
                return BadRequest("Vec ste zapoceli posao za ovaj oglas");

            var prijava = await _prijavaService.GetById(posaoDTO.Prijava);
            var cenaBotThreshold = prijava.Ponuda * 0.7;
            var cenaTopThreshold = prijava.Ponuda * 1.3;

            if (posaoDTO.Cena < 1000 || posaoDTO.Cena > 100000000)
                return BadRequest("Cena posla mora da bude izmedju 1000 i 100000000 dinara");

            if (posaoDTO.Cena < cenaBotThreshold || posaoDTO.Cena > cenaTopThreshold)
                return BadRequest("Prevelika ili premala cena posla");

            if (korisnik.NovacNaSajtu < posaoDTO.Cena)
                return StatusCode(402, "Nemate dovoljno novca da platite ovaj posao");

            if (!korisnik.OglasiId.Contains(posaoDTO.Oglas))
                return BadRequest("Ovo nije vas oglas");

            var izvodjac = await GetIzvodjacById(posaoDTO.Izvodjac, posaoDTO.TipIzvodjaca);
            if (izvodjac is null)
                return NotFound(GetIzvodjacErrorMessage(posaoDTO.TipIzvodjaca));

            if (!izvodjac.OglasiId.Contains(posaoDTO.Oglas))
                return BadRequest("Izvodjac nije prijavljen na ovaj oglas");

            Posao posao = new Posao
            {
                Korisnik = posaoDTO.Korisnik,
                Izvodjac = new Izvodjac
                {
                    IzvodjacId = posaoDTO.Izvodjac,
                    TipIzvodjaca = posaoDTO.TipIzvodjaca
                },
                DetaljiPosla = new DetaljiPosla
                {
                    Cena = posaoDTO.Cena,
                    Opis = posaoDTO.Opis,
                    Naslov = posaoDTO.Naslov
                },
                Oglas = posaoDTO.Oglas,
                ZavrsetakRadova = posaoDTO.ZavrsetakRadova
            };
            await _posaoService.Create(posao);

            return Ok($"Uspesno kreiran posao sa ID-em {posao.Id}!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Korisnik)]
    [HttpPatch("ZavrsiByKorisnik")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ZavrsiByKorisnik(ZavrsiPosaoDTO zavrsi)
    {
        try
        {
            var korisnikId = HttpContext.User.Identity?.Name;
            if (korisnikId is null)
                return Unauthorized();

            var korisnik = await _korisnikService.GetById(korisnikId);

            var posao = await _posaoService.GetById(zavrsi.Posao);
            if (posao.Zavrsen)
                return BadRequest("Posao je vec zavrsen");
            if (posao.Korisnik != korisnikId)
                return BadRequest("Ne smete da zavrsite tudji oglas");
            if (posao.Recenzije.RecenzijaKorisnika is not null)
                return BadRequest("Vec ste zavrsili posao sa vase strane");
            //if (posao.ZavrsetakRadova > DateTime.Now)
            //    return BadRequest("Vreme zavrsetka posla jos nije isteklo");

            await _posaoService.ZavrsiByKorisnik(zavrsi);
            return Ok("Uspesno ste zavrsili posao sa vase strane");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(Roles.Majstor, Roles.Firma)]
    [HttpPatch("ZavrsiByIzvodjac")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ZavrsiByIzvodjac(ZavrsiPosaoDTO zavrsi)
    {
        try
        {
            var izvodjacId = HttpContext.User.Identity?.Name;
            if (izvodjacId is null)
                return Unauthorized();
            var tipIzvodjaca = UtilityCheck.GetRole(HttpContext);

            var izvodjac = await GetIzvodjacById(izvodjacId, tipIzvodjaca);

            var posao = await _posaoService.GetById(zavrsi.Posao);
            if (posao.Zavrsen)
                return BadRequest("Posao je vec zavrsen");
            if (posao.Izvodjac.IzvodjacId != izvodjacId)
                return BadRequest("Ne smete da zavrsite tudji oglas");
            if (posao.Recenzije.RecenzijaIzvodjaca is not null)
                return BadRequest("Vec ste zavrsili posao sa vase strane");
            //if (posao.ZavrsetakRadova > DateTime.Now)
            //    return BadRequest("Vreme zavrsetka posla jos nije isteklo");

            await _posaoService.ZavrsiByIzvodjac(zavrsi);
            return Ok("Uspesno ste zavrsili posao sa vase strane");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    //[Authorize]
    [HttpDelete("Delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var postojeciPosao = await _posaoService.GetById(id);
            if (postojeciPosao is null)
            {
                return NotFound($"Posao sa ID-em {id} ne postoji!");
            }
            await _posaoService.Delete(id);
            return Ok($"Posao sa ID-em {id} je uspesno obrisan!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}