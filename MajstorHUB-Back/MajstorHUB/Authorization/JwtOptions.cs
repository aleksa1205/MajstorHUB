﻿using Microsoft.Extensions.Configuration;

namespace MajstorHUB.Authorization;

public class JwtOptions
{
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string SecretKey { get; set; }

    public JwtOptions(IConfiguration confing)
    {
        Issuer = confing.GetSection("Jwt").GetSection("Issuer").Value!;
        Audience = confing.GetSection("Jwt").GetSection("Audience").Value!;
        SecretKey = confing.GetSection("Jwt").GetSection("Key").Value!;
    }
}