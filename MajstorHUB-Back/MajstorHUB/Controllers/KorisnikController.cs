using MajstorHUB.Models;
using MajstorHUB.Services;
using Microsoft.AspNetCore.Mvc;

namespace MajstorHUB.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KorisnikController : ControllerBase
    {
        private readonly IKorisnikService _korisnikService;

        public KorisnikController(IKorisnikService korisnikService)
        {
            this._korisnikService = korisnikService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<Korisnik>>> Get()
        {
            var listaKorisnika = await _korisnikService.Get();
            if(listaKorisnika== null)
            {
                return NotFound($"Ne postoji nijedan korisnik u bazi!\n");
            }
            return listaKorisnika;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Korisnik>> Get(string id)
        {
            var korisnik = await _korisnikService.Get(id);
            if (korisnik == null)
            {
                //Ne stampa ovo ovde
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
            return korisnik;
        }

        [HttpPost]
        public async Task<ActionResult<Korisnik>> Post([FromBody] Korisnik korisnik)
        {
            await _korisnikService.Create(korisnik);
            return Ok($"Dodat je korisnik sa ID-em {korisnik.Id}!\n");
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Put(string id, [FromBody] Korisnik korisnik)
        {
            var postojeciKorisnik = await _korisnikService.Get(id);
            if (postojeciKorisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
            await _korisnikService.Update(id, korisnik);
            return Ok($"Korisnik sa ID-em {id} je uspesno azuriran!\n");
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(string id)
        {
            var postojeciKorisnik = await _korisnikService.Get(id);
            if (postojeciKorisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
            await _korisnikService.Delete(id);
            return Ok($"Korisnik sa ID-em {id} je uspesno obrisan!\n");
        }
    }
}