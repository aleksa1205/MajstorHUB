using MajstorHUB.Models;
using Microsoft.AspNetCore.Mvc;

namespace MajstorHUB.Services;

public interface IFirmaService
{
    //Moze se dodati Get metoda za pib firme kao i get metoda koja vraca sve firme
    Task<Firma> Get(string id);
    Task<Firma> Create(Firma firma);
    void Update(string id, Firma firma);
    void Delete(string id);
}
