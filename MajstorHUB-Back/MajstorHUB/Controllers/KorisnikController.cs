<<<<<<< Updated upstream
﻿using MajstorHUB.Models;
using MajstorHUB.Services;
using Microsoft.AspNetCore.Mvc;
=======
﻿using MajstorHUB.Authorization;
using Utlity;
>>>>>>> Stashed changes

namespace MajstorHUB.Controllers
{
<<<<<<< Updated upstream
    [ApiController]
    [Route("[controller]")]
    public class KorisnikController : ControllerBase
    {
        private readonly IKorisnikService _korisnikService;
=======
    private readonly IKorisnikService _korisnikService;
    private IConfiguration configuration;

    public KorisnikController(IKorisnikService korisnikService, IConfiguration configuration)
    {
        this._korisnikService = korisnikService;
        this.configuration = configuration;
    }
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetByJmbg/{jmbg}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetByJmbg(string jmbg)
    {
        try
        {
            if (!UtilityCheck.IsValidJmbg(jmbg)) return BadRequest("JMBG mora sadrzati 13 broja!\n");

            var korisnik = await _korisnikService.GetByJmbg(jmbg);
            if (korisnik == null) return NotFound($"Korisnik sa JMBG-om {jmbg} ne postoji!\n");
            return Ok(korisnik);
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
            if (!UtilityCheck.IsValidEmail(email)) return BadRequest("Pogresan format email-a!");

            var korisnik = await _korisnikService.GetByEmail(email);
            if (korisnik == null) return NotFound($"Korisnik sa Email-om {email} ne postoji!\n");
            return Ok(korisnik);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Post([FromBody] Korisnik korisnik)
    {
        try
        {
            korisnik.Password = BCrypt.Net.BCrypt.HashPassword(korisnik.Password);

            if ((await _korisnikService.GetByJmbg(korisnik.JMBG)) != null)
                return BadRequest($"Korisnik sa JMBG-om {korisnik.JMBG} vec postoji!\n");
            if ((await _korisnikService.GetByEmail(korisnik.Email)) != null)
                return BadRequest($"Korisnik sa Email-om {korisnik.Email} vec postoji!\n");

>>>>>>> Stashed changes
            await _korisnikService.Create(korisnik);
            return Ok($"Dodat je korisnik sa ID-em {korisnik.Id}!\n");
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Put(string id, [FromBody] Korisnik korisnik)
        {
<<<<<<< Updated upstream
            var postojeciKorisnik = await _korisnikService.Get(id);
=======
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Login(string email, string password)
    {
        try
        {
            var korisnik = await _korisnikService.GetByEmail(email);
            if (korisnik is null)
                return BadRequest("Korisnik sa zadatim Email-om ne postoji");

            var hashPassword = BCrypt.Net.BCrypt.Verify(password, korisnik.Password);
            JwtOptions jwtOptions = new JwtOptions();

            var myconfig = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            jwtOptions.Issuer = configuration.GetSection("Jwt").GetSection("Issuer").Value;
            jwtOptions.Audience = configuration.GetSection("Jwt").GetSection("Audience").Value;
            jwtOptions.SecretKey = configuration.GetSection("Jwt").GetSection("Key").Value;

            var jwtprov = new JwtProvider(jwtOptions);
            var token = jwtprov.Generate(korisnik);
            return Ok(token);
            


            //generisanje tokena...
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("Update/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Put(string id, [FromBody] Korisnik korisnik)
    {
        try
        {
            if ((await _korisnikService.GetByJmbg(korisnik.JMBG)) != null)
                return BadRequest($"Korisnik sa JMBG-om {korisnik.JMBG} vec postoji!\n");
            if ((await _korisnikService.GetByEmail(korisnik.Email)) != null)
                return BadRequest($"Korisnik sa Email-om {korisnik.Email} vec postoji!\n");

            var postojeciKorisnik = await _korisnikService.GetById(id);
>>>>>>> Stashed changes
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