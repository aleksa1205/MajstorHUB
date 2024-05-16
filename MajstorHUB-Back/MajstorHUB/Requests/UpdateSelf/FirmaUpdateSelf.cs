namespace MajstorHUB.Requests.UpdateSelf
{
    public class FirmaUpdateSelf : UserUpdateSelf
    {
        public required string Naziv { get; set; }
        public required List<Struka> Struke { get; set; }
        public required Iskustvo Iskustvo { get; set; }
        public required double CenaPoSatu { get; set; }
    }
}
