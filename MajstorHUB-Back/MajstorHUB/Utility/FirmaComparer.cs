namespace MajstorHUB.Utility;

public class FirmaComparer : IEqualityComparer<Firma>
{
    public bool Equals(Firma x, Firma y)
    {
        return x.Naziv == y.Naziv && x.PIB == y.PIB && x.Email == y.Email && x.Struke == y.Struke;
    }

    public int GetHashCode(Firma obj)
    {
        return obj.PIB.GetHashCode();
    }
}
