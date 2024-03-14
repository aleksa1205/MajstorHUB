using MajstorHUB.Models;

namespace MajstorHUB.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecenzijaController : ControllerBase
    {
        private readonly IRecenzijaService _recenzijaService;

        public RecenzijaController(IRecenzijaService recenzijaService, IKorisnikService korisnikService, IMajstorService majstorService, IFirmaService firmaService)
        {
            _recenzijaService = recenzijaService;
        }

        [HttpGet("GetAll")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var recenzije = await _recenzijaService.GetAll();
                if (recenzije.Count == 0)
                {
                    return NotFound("Nijedna recenzija ne postoji u bazi!\n");
                }
                return Ok(recenzije);
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
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var recenzija = await _recenzijaService.GetById(id);
                if (recenzija == null)
                {
                    return NotFound($"Recenzija sa ID-em {id} ne postoji!\n");
                }
                return Ok(recenzija);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Add
        //Put

        [HttpDelete("Delete/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var postojecaRecenzija = await _recenzijaService.GetById(id);
                if (postojecaRecenzija == null)
                    return NotFound($"Recenzija sa ID-em {id} ne postoji!\n");

                await _recenzijaService.Delete(id);
                return Ok($"Recenzija sa ID-em {id} je uspesno obrisan!\n");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
