namespace MajstorHUB.Requests.Filter;

public class FilterOglasDTO
{
    public string Query { get; set; } = string.Empty;
    public string Opis { get; set; } = string.Empty;
    public List<Iskustvo> Iskustva { get; set; } = [];
    public List<DuzinaPosla> DuzinePosla { get; set; } = [];
    public CenaRange Cena { get; set; } = new CenaRange();
    //public double Zaradjeno { get; set; } = 0;
}
