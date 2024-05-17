namespace MajstorHUB.Requests.UpdateSelf
{
    public class MajstorUpdateSelf : UserUpdateSelf
    {
        public required string Ime { get; set; }
        public required string Prezime { get; set; }
        public required DateTime DatumRodjenja { get; set; }
        public required Struka Struka { get; set; }
        public required Iskustvo Iskustvo { get; set; }
        public required double CenaPoSatu { get; set; }
    }
}
