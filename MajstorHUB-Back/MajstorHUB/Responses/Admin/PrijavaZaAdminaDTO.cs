namespace MajstorHUB.Responses.Admin;

public class PrijavaZaAdminaDTO
{
    public required string userId { get; set; }
    public required Roles userType { get; set; }
    public required string Naziv { get; set; }
}
