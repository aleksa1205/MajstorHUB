﻿namespace MajstorHUB.Requests.Filter;

public class FilterKorisnikDto
{
    public string Query { get; set; } = string.Empty;
    public string Opis { get; set; } = string.Empty;
    public double Potroseno { get; set; } = 0;
}
