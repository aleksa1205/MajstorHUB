using MajstorHUB.Models.Enums;
using MajstorHUB.Models.Users;

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

    public static Roles GetRole(HttpContext context)
    {
        Roles role = Roles.Nedefinisano;

        foreach (var claim in context.User.Claims)
        {
            if (claim.Type == "Role")
                role = (Roles)Enum.Parse(typeof(Roles), claim.Value);
        }

        return role;
    }

    public static string GetEmail(HttpContext context)
    {
        string email = "";

        foreach (var claim in context.User.Claims)
        {
            if (claim.Type == JwtRegisteredClaimNames.Email)
                email = claim.Value;
        }

        return email;
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

    public static bool IsValidQuery(string query)
    {
        var words = query.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        return query.Length <= 50 && words.Length <= 10;
    }

    public static bool IsValidStruke(List<Struka> struke)
    {
        return struke.Count <= 15;
    }

    public static bool CheckPonudaThreshold(double cena, double ponuda)
    {
        double lowerThreshold = cena * 0.85;
        double upperThreshold = cena * 1.15;
        return ponuda >= lowerThreshold && ponuda <= upperThreshold;
    }

    public static double CalculateStrukeScore(List<Struka> oglasStruke, List<Struka> firmaStruke, out List<Struka> matchingStruke)
    {
        int matchCount = 0;
        matchingStruke = [];
        foreach(var struka in oglasStruke)
        {
            if(firmaStruke.Contains(struka))
            {
                matchCount++;
                matchingStruke.Add(struka);
            }
        }
        //int matchCount = oglasStruke.Count(firmaStruke.Contains);
        return (double)matchCount / oglasStruke.Count * 100;
    }

    public static int CalculateMatchingScore(Oglas oglas, User user, double ponuda, Roles userType, out List<Struka> matchingStruke)
    {
        double score = 0;
        const double ponudaWeight = 0.33;
        const double strukeWeight = 0.34;
        const double iskustvoWeight = 0.33;

        matchingStruke = [];
        if (userType == Roles.Firma)
        {
            var firma = user as Firma;
            if (firma is not null)
            {
                score += (oglas.Iskustvo == firma.Iskustvo ? 100 : 0) * iskustvoWeight;
                score += CalculateStrukeScore(oglas.Struke, firma.Struke, out matchingStruke) * strukeWeight;
                score += (CheckPonudaThreshold(oglas.Cena, ponuda) ? 100 : 0) * ponudaWeight;
            }
            else
                throw new Exception("Greska pri kastovanju user-a u firmu");
        }
        else if (userType == Roles.Majstor)
        {
            var majstor = user as Majstor;
            if (majstor is not null)
            {
                score += (oglas.Iskustvo == majstor.Iskustvo ? 100 : 0) * iskustvoWeight;
                if(oglas.Struke.Contains(majstor.Struka))
                {
                    score += 100 * strukeWeight;
                    matchingStruke.Add(majstor.Struka);
                }
                score += (CheckPonudaThreshold(oglas.Cena, ponuda) ? 100 : 0) * ponudaWeight;
            }
            else
                throw new Exception("Greska pri kastovanju user-a u majstora");
        }
        else
            throw new NotSupportedException("Tip user-a mora da bude majstor ili firma");

        return (int)Math.Round(score);
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