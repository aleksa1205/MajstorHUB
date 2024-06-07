namespace MajstorHUB.Requests.Prijava;

public class CreatePrijavaDTO
{
    public required string OglasId { get; set; }
    public required double Ponuda { get; set; }
    public string? Opis { get; set; }
    public required int Bid { get; set; }
}
