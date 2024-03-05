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

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Korisnik>> Get(string id)
        {
            var korisnik = _korisnikService.Get(id);
            if (korisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
            return await korisnik;
        }

        [HttpPost]
        public async Task<ActionResult<Korisnik>> Post([FromBody] Korisnik korisnik)
        {
            await _korisnikService.Create(korisnik);
            return korisnik;
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult Put(string id, [FromBody] Korisnik korisnik)
        {
            var postojeciKorisnik = _korisnikService.Get(id);
            if (postojeciKorisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
            _korisnikService.Update(id, korisnik);
            return Ok("Korisnik sa ID-em {id} je uspesno azuriran!\n");
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult Delete(string id)
        {
            var postojeciKorisnik = _korisnikService.Get(id);
            if (postojeciKorisnik == null)
            {
                return NotFound($"Korisnik sa ID-em {id} ne postoji!\n");
            }
            _korisnikService.Delete(id);
            return Ok($"Korisnik sa ID-em {id} je uspesno obrisan!\n");
        }
        //EXISTS
    }
}