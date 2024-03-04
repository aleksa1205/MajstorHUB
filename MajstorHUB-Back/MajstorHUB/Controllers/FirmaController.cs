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