using MajstorHUB.Models.Users;

namespace MajstorHUB.Utility.Comparers;

public class KorisnikComparer : IEqualityComparer<Korisnik>
{
    public bool Equals(Korisnik x, Korisnik y)
    {
        return x.JMBG == y.JMBG && x.Ime == y.Ime && x.Prezime == y.Prezime && x.Email == y.Email;
    }

    public int GetHashCode(Korisnik obj)
    {
        return obj.JMBG.GetHashCode();
    }
}
