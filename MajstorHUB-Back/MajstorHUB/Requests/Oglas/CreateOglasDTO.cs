namespace MajstorHUB.Requests.Oglas;

public class CreateOglasDTO
{
    public required string Naslov { get; set; }
    public Iskustvo Iskustvo { get; set; } = Iskustvo.Nedefinisano;
    public required List<Struka> Struke { get; set; }
    public required string Opis { get; set; }
    public required double Cena { get; set; }
    public DuzinaPosla DuzinaPosla { get; set; } = DuzinaPosla.Nedefinisano;
    public string? Lokacija { get; set; }
}
