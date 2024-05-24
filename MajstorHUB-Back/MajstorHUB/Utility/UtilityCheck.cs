namespace Utlity;

public class UtilityCheck
{
    // Proverava da je li validan email (ukrao sam od net hehe)
    public static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        try
        {
            // Normalize the domain
            email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                                  RegexOptions.None, TimeSpan.FromMilliseconds(200));

            // Examines the domain part of the email and normalizes it.
            string DomainMapper(Match match)
            {
                // Use IdnMapping class to convert Unicode domain names.
                var idn = new IdnMapping();

                // Pull out and process domain name (throws ArgumentException on invalid)
                string domainName = idn.GetAscii(match.Groups[2].Value);

                return match.Groups[1].Value + domainName;
            }
        }
        catch (RegexMatchTimeoutException)
        {
            return false;
        }
        catch (ArgumentException)
        {
            return false;
        }

        try
        {
            return Regex.IsMatch(email,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
        }
        catch (RegexMatchTimeoutException)
        {
            return false;
        }
    }

    public static bool IsValidJmbg(string jmbg)
    {
        return jmbg.Length == 13 && jmbg.All(Char.IsNumber);
    }

    public static bool IsValidPib(string pib)
    {
        return pib.Length == 8 && pib.All(Char.IsNumber);
    }

    public static bool IsValidOcena(double ocena)
    {
        return ocena >= 1 && ocena <= 5;
    }

    public static bool IsValidRecenzentRecenzirani(string recenzent, string recenzirani)
    {
        return recenzent != recenzirani;
    }

    public static bool IsValidStruke(List<Struka> struke)
    {
        return struke.Count <= 15;
    }

    // NE KORISTI SE OVA FUNKCIJA, jer ako se unosi korisnik FromBody automatski se proverava kao sto stoji u models
    // Proverava korisnika, ako je sve u redu vraca true
    // ako nije vraca false i puni errorMessage adekvatnom porukom
    // koje ce da ubaci u BadRequest()
    public static bool IsValidKorisnik(Korisnik korisnik, out string errorMessage)
    {
        bool result = false;
        errorMessage = "";

        if (!IsValidJmbg(korisnik.JMBG))
            errorMessage = "JMBG mora sadrzati 13 broja!\n";
        else if (!IsValidEmail(korisnik.Email))
            errorMessage = "Pogresan format email-a";
        else
            result = true;

        return result;
    }
}