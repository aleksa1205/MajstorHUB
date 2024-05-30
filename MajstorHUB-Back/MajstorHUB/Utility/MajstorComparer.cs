namespace MajstorHUB.Utility;

public class MajstorComparer : IEqualityComparer<Majstor>
{
    public bool Equals(Majstor x, Majstor y)
    {
        return x.JMBG == y.JMBG && x.Ime == y.Ime && x.Prezime == y.Prezime && x.Email == y.Email && x.Struka == y.Struka;
    }

    public int GetHashCode(Majstor obj)
    {
        return obj.JMBG.GetHashCode();
    }
}
