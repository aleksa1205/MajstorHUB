using MajstorHUB.Services;
using MajstorHUB.Models;
using Microsoft.AspNetCore.Mvc;

namespace MajstorHUB.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FirmaController : ControllerBase
    {
        private readonly IFirmaService _firmaService;

        public FirmaController(IFirmaService firmeService)
        {
            this._firmaService = firmeService;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Firma>> Get(String id)
        {
            var firma = _firmaService.Get(id);
            if (firma == null)
            {
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");
            }
            return await firma;
        }

        [HttpPost]
        public async Task<ActionResult<Firma>> Post([FromBody] Firma firma)
        {
<<<<<<< Updated upstream
=======
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByPib/{pib}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetByPib(string pib)
    {
        try
        {
            if (!UtilityCheck.IsValidPib(pib)) return BadRequest("Pib mora sadrzati 8 broja!\n");

            var firma = await _firmaService.GetByPib(pib);
            if (firma == null)
                return NotFound($"Firma sa PIB-om {pib} ne postoji!\n");
            return Ok(firma);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByEmail/{email}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetByEmail(string email)
    {
        try
        {
            if (!UtilityCheck.IsValidEmail(email)) return BadRequest("\"Pogresan format email-a!\n");

            var firma = await _firmaService.GetByEmail(email);
            if (firma is null)
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

>>>>>>> Stashed changes
            await _firmaService.Create(firma);
            return firma;
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult Put(String id, [FromBody] Firma firma)
        {
            var postojecaFirma = _firmaService.Get(id);
            if (postojecaFirma == null)
            {
                return NotFound($"Firma sa ID-em {id} ne posotji!\n");
            }
            _firmaService.Update(id, firma);
            return Ok($"Firma sa ID-em {id} je uspesno azurirana!\n");
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult Delete(string id)
        {
            var postojecaFirma = _firmaService.Get(id);
            if (postojecaFirma == null)
            {
                return NotFound($"Firma sa ID-em {id} ne postoji!\n");
            }
            _firmaService.Delete(id);
            return Ok($"Firma sa ID-em {id} je uspesno obrisana!\n");
        }
    }
}