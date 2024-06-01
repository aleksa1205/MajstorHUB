using MajstorHUB.Requests.Posao;
using MajstorHUB.Services.PosaoService;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver.Core.Authentication;
using System.Runtime.CompilerServices;

namespace MajstorHUB.Controllers;

[ApiController]
[Route("[controller]")]
public class PosaoController : ControllerBase
{
    private readonly IPosaoService _posaoService;
    private readonly IKorisnikService _korisnikService;
    private readonly IFirmaService _firmaService;
    private readonly IMajstorService _majstorService;
    private readonly IOglasService _oglasService;
    private IConfiguration _configuration;

    public PosaoController(IPosaoService posaoService, IKorisnikService korisnikService, IFirmaService firmaService, IMajstorService majstorService, IOglasService oglasService, IConfiguration configuration)
    {
        _posaoService = posaoService;
        _korisnikService = korisnikService;
        _firmaService = firmaService;
        _majstorService = majstorService;
        _oglasService = oglasService;
        _configuration = configuration;
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

    [HttpGet("GetByID/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByID(string id)
    {
        try
        {
            var posao = await _posaoService.GetById(id);
            if (posao is null)
                return NotFound($"Posao sa ID-em {id} ne postoji!");
            return Ok(posao);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByKorisnik/{idKorisnika}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByKorisnik(string idKorisnika)
    {
        try
        {
            var poslovi = await _posaoService.GetByKorisnik(idKorisnika);
            if (poslovi.Count == 0) 
                return NotFound($"Korisnik sa ID-em {idKorisnika} nema nijedan sklopljen postoji!");
            return Ok(poslovi);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByIzvodjac/{idIzvodjaca}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIzvodjac(string idIzvodjaca)
    {
        try
        {
            var poslovi = await _posaoService.GetByIzvodjac(idIzvodjaca);
            if (poslovi.Count == 0)
                return NotFound($"Izvodjac sa ID-em {idIzvodjaca} nema nijedan sklopljen postoji!");
            return Ok(poslovi);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPost("Post")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Post(CreatePosaoDTO posaoDTO)
    {
        try
        {
            Korisnik korisnik = await _korisnikService.GetById(posaoDTO.Korisnik);
            if(korisnik is null)
            {
                return NotFound($"Korisnik sa ID-em {posaoDTO.Korisnik} nije pronađen!");
            }
            Firma firma = await _firmaService.GetById(posaoDTO.Izvodjac);
            Majstor majstor = await _majstorService.GetById(posaoDTO.Izvodjac);
            if(firma is null && majstor is null)
            {
                return NotFound($"Izvodjac radova sa ID-em {posaoDTO.Izvodjac} nije pronađen!");
            }
            Oglas oglas = await _oglasService.GetById(posaoDTO.Oglas);
            if(oglas is null)
            {
                return NotFound($"Oglas sa ID-em {posaoDTO.Oglas} nije pronađen!");
            }

            Posao posao = new Posao
            {
                Korisnik = posaoDTO.Korisnik,
                Izvodjac = posaoDTO.Izvodjac,
                Oglas = posaoDTO.Oglas,
                Cena = posaoDTO.Cena,
                Opis = posaoDTO.Opis,
                KrajRadova = posaoDTO.KrajRadova
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
    [HttpDelete("Delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var postojeciPosao = await _posaoService.GetById(id);
            if(postojeciPosao is null)
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
