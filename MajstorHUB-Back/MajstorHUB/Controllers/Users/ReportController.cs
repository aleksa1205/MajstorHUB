using MajstorHUB.Services.ReportService;

namespace MajstorHUB.Controllers.Users;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;
    private IConfiguration _configuaration;

    public ReportController(IReportService reportService, IConfiguration configuaration)
    {
        _reportService = reportService;
        _configuaration = configuaration;
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var lista = await _reportService.GetAll();
            if (lista.Count == 0)
                return NotFound("Na platformi nema prijavljenih korisnika!");
            return Ok(lista);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpGet("GetById/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string id)
    {
        try
        {
            var report = await _reportService.GetByID(id);
            if (report is null)
                return NotFound($"Prijava sa ID-em {id} ne postoji!");
            return Ok(report);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpGet("GetByReported/{reportedId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByReported(string reportedId)
    {
        try
        {
            var lista = await _reportService.GetByReported(reportedId);
            if (lista.Count == 0)
                return NotFound($"Za user-a sa datim ID-em {reportedId} nisu nadjene prijave!");
            return Ok(lista);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPost("Report")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Report([FromBody] Report report)
    {
        try
        {
            report.Inicijator = HttpContext.User.Identity?.Name;
            report.TipInicijatora = UtilityCheck.GetRole(HttpContext);
            await _reportService.Create(report);
            return Ok($"Prijava sa ID-em {report.Id} uspesno dodata!");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpDelete("DeleteReport/{reportId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Delete(string reportId)
    {
        try
        {
            await _reportService.Delete(reportId);
            return Ok($"Uspesno obrisana prijava sa ID-em {reportId}!");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
