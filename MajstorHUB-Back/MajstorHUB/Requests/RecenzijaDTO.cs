namespace MajstorHUB.Requests;

public class RecenzijaDTO
{
    public required string Recenzent { get; set; }
    public required Roles RecenzentType { get; set; }
    public required string Recenzirani { get; set; }
    public required Roles RecenziraniType { get; set; }
    public required double Ocena { get; set; }
    public required string Opis { get; set; }
}
