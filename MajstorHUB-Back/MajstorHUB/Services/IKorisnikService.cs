using MajstorHUB.Models;
using Microsoft.AspNetCore.Mvc;

namespace MajstorHUB.Services
{
    public interface IKorisnikService
    {
        //Moze da se doda Get metoda za celu listu korisnika
        //Moze da se doda Get metoda za pretragu korisnika po jmbg-u
        //Task<List<Korisnik>> Get();
        Task<List<Korisnik>> Get();
        Task<Korisnik> Get(string id);
        Task<Korisnik> Create(Korisnik korisnik);
        Task Update(string id, Korisnik korisnik);
        Task Delete(string id);
    }
}