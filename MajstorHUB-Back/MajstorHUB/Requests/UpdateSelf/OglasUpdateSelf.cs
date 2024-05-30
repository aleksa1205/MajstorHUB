namespace MajstorHUB.Requests.UpdateSelf
{
    public class OglasUpdateSelf
    {
        public required string Id { get; set; }
        public required string Naslov { get; set; }
        public required Iskustvo Iskustvo { get; set; }
        public required List<Struka> Struke { get; set; }
        public string? Opis { get; set; }
        public required double Cena { get; set; }
        public required DuzinaPosla DuzinaPosla { get; set; }
        public string? Lokacija { get; set; }
    }
}