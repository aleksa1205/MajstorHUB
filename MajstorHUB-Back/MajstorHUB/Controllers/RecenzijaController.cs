using Amazon.Runtime.Internal;
using MajstorHUB.Models;
using System.Threading.Tasks.Dataflow;

namespace MajstorHUB.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecenzijaController : ControllerBase
    {
        private readonly IRecenzijaService _recenzijaService;
        private readonly IMajstorService _majstorService;
        private readonly IFirmaService _firmaService;
        private readonly IKorisnikService _korisnikService;

        public RecenzijaController(
            IRecenzijaService recenzijaService,
            IMajstorService majstorService,
            IFirmaService firmaService,
            IKorisnikService korisnikService)
        {
            _recenzijaService = recenzijaService;
            _majstorService = majstorService;
            _firmaService = firmaService;
            _korisnikService = korisnikService;
        }

        private async Task<User> GetUserById(string userId, Roles userType)
        {
            switch(userType)
            {
                case Roles.Firma:
                    return await _firmaService.GetById(userId);
                case Roles.Korisnik:
                    return await _korisnikService.GetById(userId);
                case Roles.Majstor:
                    return await _majstorService.GetById(userId);
                default:
                    throw new NotSupportedException("Tip koji je prosledjen nije podrzan!\n");
            }
        }

        private string GetUserErrorMessage(Roles userType)
        {
            switch (userType)
            {
                case Roles.Firma:
                    return "Majstor sa prosledjenim ID-em nije pronadjen!\n";
                case Roles.Korisnik:
                    return "Korinsik sa prosledjenim ID-em nije pronadjen!\n";
                case Roles.Majstor:
                    return "Firma sa prosledjenim ID-em nije pronadjena!\n";
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
                return Ok(recenzija);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Add(RecenzijaDTO recenzijaDto)
        {
            try
            {
                var recenzent = await GetUserById(recenzijaDto.Recenzent, recenzijaDto.RecenzentType);
                if (recenzent == null)
                    return NotFound(GetUserErrorMessage(recenzijaDto.RecenzentType));

                var recenzirani = await GetUserById(recenzijaDto.Recenzirani, recenzijaDto.RecenziraniType);
                if (recenzirani == null)
                    return NotFound(GetUserErrorMessage(recenzijaDto.RecenziraniType));

                var recenzija = new Recenzija()
                {
                    Recenzent = recenzijaDto.Recenzent,
                    Recenzirani = recenzijaDto.Recenzirani,
                    Ocena = recenzijaDto.Ocena,
                    Opis = recenzijaDto.Opis
                };

                await _recenzijaService.Create(recenzija);
                return Ok(recenzija);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
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
