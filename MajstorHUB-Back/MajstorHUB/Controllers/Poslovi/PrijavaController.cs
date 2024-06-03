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

    private async Task UpdateIzvodjac(Roles userType, User user)
    {
        if (userType == Roles.Firma && user is not Firma)
            throw new NotSupportedException("Niste uneli firmu a tip izvodjaca vam je firma");
        if (userType == Roles.Majstor && user is not Majstor)
            throw new NotSupportedException("Niste uneli majstora a tip izvodjaca vam je majstor");

        switch (userType)
        {
            case Roles.Firma:
                var firma = user as Firma;
                if (firma != null)
                {
                    await _firmaService.Update(firma.Id!, firma);
                }
                break;
            case Roles.Majstor:
                var majstor = user as Majstor;
                if (majstor != null)
                {
                    await _majstorService.Update(majstor.Id!, majstor);
                }
                break;
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
    [HttpPost("Prijavi-se")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

            var oglas = await _oglasService.GetById(prijava.OglasId);
            if (oglas is null)
                return NotFound("Oglas sa prosledjenim ID-em nije pronadjen");

            if (izvodjac.OglasiId.Contains(oglas.Id!))
                return BadRequest("Imate pravo na samo jednu prijavu po poslu");


            var novaPrijava = new Prijava
            {
                IzvodjacId = izvodjacId,
                OglasId = prijava.OglasId,
                Ponuda = prijava.Ponuda,
                TipIzvodjaca = tipIzvodjaca,
                Opis = prijava.Opis
            };

            await _prijavaService.Create(novaPrijava);

            //oglas.PrijaveIds.Add(novaPrijava.Id!);
            //await _oglasService.Update(oglas.Id!, oglas);

            //izvodjac.OglasiId.Add(prijava.OglasId);
            //await UpdateIzvodjac(tipIzvodjaca, izvodjac);

            return Ok($"Uspesno kreirana prijava sa ID-em {novaPrijava.Id}!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

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

            //var izvodjac = await GetIzvodjacById(postojecaPrijava.IzvodjacId, postojecaPrijava.TipIzvodjaca);
            //if(izvodjac is not null)
            //{
            //    if (!izvodjac.OglasiId.Remove(postojecaPrijava.OglasId))
            //        return BadRequest("Nismo uspeli da izbrisemo id oglasa iz izvodjaca");
            //}

            //var oglas = await _oglasService.GetById(postojecaPrijava.OglasId);
            //if (oglas is not null)
            //{
            //    if (!oglas.PrijaveIds.Remove(postojecaPrijava.Id!))
            //        return BadRequest("Nismo uspeli da izbrisemo prijavu sa oglasa");
            //}

            await _prijavaService.Delete(id);
            return Ok($"Prijava sa ID-em {id} je uspesno obrisana!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
