namespace MajstorHUB.Controllers.Users;

[ApiController]
[Route("[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private IConfiguration _configuration;

    public AdminController(IAdminService adminService, IConfiguration configuration)
    {
        _adminService = adminService;
        _configuration = configuration;
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpGet("GetAllBlockedUsers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllBlockedUsers()
    {
        try
        {
            var lista = await _adminService.GetAllBlockedUsers();
            if (lista.Count == 0)
                return NotFound("Na platformi nema blokiranih korisnika!");
            return Ok(lista);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Admin, AdminRoles.SudoAdmin)]
    [HttpPatch("BlockUser/{userId}/{role}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> BlockUser(string userId, Roles role)
    {
        try
        {
            var adminId = HttpContext.User.Identity?.Name;
            var result = await _adminService.BlockUser(adminId!, userId, role);
            if (result is false)
                return NotFound("Greška pri pribavljanju korisnika!");
            return Ok($"Uspešno blokiran user sa ID-em {userId}!");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.Nedefinisano)]
    [HttpPost("SignUpForAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SignUpForAdmin()
    {
        try
        {
            var user = HttpContext.User.Identity?.Name;
            if (!(await _adminService.SignUpAsAdmin(user!)))
            {
                return BadRequest("Već ste prijavljeni i čekate odgovor!");
            }
            return Ok($"Uspešno prosleđena prijava sudo-adminu!");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.SudoAdmin)]
    [HttpPost("EnrolAsAdmin/{userId}/{role}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> EnrolAsAdmin(string userId, Roles role)
    {
        try
        {
            if(!(await _adminService.EnrolAsAdmin(userId, role)))
            {
                return BadRequest("Greška pri dodavanju admina!");
            }
            return Ok($"Dodat admin sa ID-em {userId}!");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [RequiresClaim(AdminRoles.SudoAdmin)]
    [HttpPatch("RejectAdmin/{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RejectAdmin(string userId)
    {
        try
        {
            if (!(await _adminService.RejectAdmin(userId)))
            {
                return BadRequest("Greška pri odbijanju admina!");
            }
            return Ok("Uspešno obrisana prijava!");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
