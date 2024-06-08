namespace MajstorHUB.Responses.Posao;

public class GetByZapocetiDTO
{
    public required string KorisnikNaziv { get; set; }
    public required string IzvodjacNaziv { get; set; }
    public required Roles TipIzvodjaca { get; set; }
    public required double Cena { get; set; }
    public required string Opis { get; set; }
    public required DateTime PocetakRadova { get; set; }
    public required DateTime ZavrsetakRadova { get; set; }
}
