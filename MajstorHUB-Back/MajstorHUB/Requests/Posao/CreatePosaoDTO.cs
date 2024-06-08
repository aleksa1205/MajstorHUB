namespace MajstorHUB.Requests.Posao;

public class CreatePosaoDTO
{
    public required string Korisnik { get; set; }
    public required string Izvodjac { get; set; }
    public required Roles TipIzvodjaca { get; set; }
    public required string Oglas { get; set; }
    public required string Prijava { get; set; }
    public required double Cena { get; set; }
    public required string Opis { get; set; }
    public required DateTime ZavrsetakRadova { get; set; }
}
