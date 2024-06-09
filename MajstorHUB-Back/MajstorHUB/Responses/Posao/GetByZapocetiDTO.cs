namespace MajstorHUB.Responses.Posao;

public class GetByZapocetiDTO
{
    public required string PosaoId { get; set; }
    public required string KorisnikNaziv { get; set; }
    public required string Korisnik { get; set; }
    public required string IzvodjacNaziv { get; set; }
    public required string Izvodjac { get; set; }
    public required Roles TipIzvodjaca { get; set; }
    public required double Cena { get; set; }
    public required string Naslov { get; set; }
    public required DateTime PocetakRadova { get; set; }
    public required DateTime ZavrsetakRadova { get; set; }
    public required string Oglas { get; set; }
    public required Recenzije Recenzije { get; set; }
}
