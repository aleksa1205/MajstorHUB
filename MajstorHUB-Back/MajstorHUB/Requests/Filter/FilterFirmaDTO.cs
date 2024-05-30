namespace MajstorHUB.Requests.Filter;

public class FilterFirmaDTO
{
    public string Query { get; set; } = string.Empty;
    public string Opis { get; set; } = string.Empty;
    public List<Iskustvo> Iskustva { get; set; } = [];
    public double CenaPoSatu { get; set; } = 0;
    public double Zaradjeno { get; set; } = 0;
}
