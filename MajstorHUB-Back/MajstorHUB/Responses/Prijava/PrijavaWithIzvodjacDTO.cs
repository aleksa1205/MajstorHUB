namespace MajstorHUB.Responses.Prijava;

public class PrijavaWithIzvodjacDTO
{
    public required string Id { get; set; }
    public required string IzvodjacId { get; set; }
    public required double Ponuda { get; set; }
    public string Opis { get; set; } = string.Empty;
    public required DateTime DatumKreiranja { get; set; }
    public required Roles TipIzvodjaca { get; set; }
    public required int Bid { get; set; }
    public required int MatchingScore { get; set; }
    public required Iskustvo Iskustvo { get; set; }
    public double CenaPoSatu { get; set; } = 0;
    public required double Zaradjeno { get; set; }
    public required string Naziv { get; set; }
    public string? Slika { get; set; }
    public string? Adresa { get; set; }
    public List<Struka> MatchingStruke { get; set; } = [];
    public string? BrojTelefona { get; set; }
    public required string Email { get; set; }
}
