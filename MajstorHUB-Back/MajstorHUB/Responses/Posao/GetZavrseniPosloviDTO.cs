namespace MajstorHUB.Responses.Posao;

public class GetZavrseniPosloviDTO
{
    public required DateTime PocetakRadova { get; set; }
    public required DateTime ZavrsetakRadova { get; set; }
    public required Recenzije Recenzije { get; set; }
    public required DetaljiPosla DetaljiPosla { get; set; }
    public required Izvodjac Izvodjac { get; set; }
    public required string Korisnik { get; set; }
    public required string Oglas { get; set; }
}
