
namespace MajstorHUB.Responses.Oglas;

public class GetOglasDTO
{
    public string? Id { get; set; }
    public required string KorisnikId { get; set; }
    public required string Ime { get; set; }
    public required string Prezime { get; set; }
    public required double Potroseno { get; set; }
    public required string Naslov { get; set; }
    public Iskustvo Iskustvo { get; set; }
    public List<Struka>? Struke { get; set; }
    public required string Opis { get; set; }
    public required double Cena { get; set; }
    public DuzinaPosla DuzinaPosla { get; set; }
    public string? Lokacija { get; set; }
    public required DateTime DatumKreiranja { get; set; }
}
