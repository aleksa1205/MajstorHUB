namespace MajstorHUB.Requests.Posao;

public class CreatePosaoDTO
{
    public required string Korisnik { get; set; }
    public required string Izvodjac { get; set; }
    public required string Oglas { get; set; }
    public required double Cena { get; set; }
    public string? Opis { get; set; }
    public required DateTime KrajRadova { get; set; }
}
