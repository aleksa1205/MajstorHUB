namespace MajstorHUB.Requests.Prijava;

public class CreatePrijavaDTO
{
    public required string Izvodjac { get; set; }
    public required string Oglas { get; set; }
    public required double Ponuda { get; set; }
    public string? Opis { get; set; }
}
