global using BCrypt.Net;

global using MongoDB.Driver;
global using MongoDB.Bson;
global using MongoDB.Bson.Serialization.Attributes;

global using System.ComponentModel.DataAnnotations;
global using System.Text;
global using System.Text.Json.Serialization;
global using System.Text.RegularExpressions;
global using System.Globalization;
global using System.Security.Claims;
global using System.IdentityModel.Tokens.Jwt;
global using System.Linq;
global using System.Collections.Generic;
global using System.Threading.Tasks;

global using Swashbuckle.AspNetCore.SwaggerGen;

global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Mvc.Filters;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.Extensions.Options;
global using Microsoft.OpenApi.Models;
global using Microsoft.IdentityModel.Tokens;

global using MajstorHUB.Authorization;
global using MajstorHUB.Authorization.JWT;
global using MajstorHUB.Authorization.Refresh;

global using MajstorHUB.Models.DatabaseSettings;
global using MajstorHUB.Models.Enums;
global using MajstorHUB.Models.Poslovi;
global using MajstorHUB.Models.Users;

global using MajstorHUB.Requests;
global using MajstorHUB.Requests.Filter;
global using MajstorHUB.Requests.Oglas;
global using MajstorHUB.Requests.Posao;
global using MajstorHUB.Requests.Prijava;
global using MajstorHUB.Requests.Users;
global using MajstorHUB.Requests.Users.Firma;
global using MajstorHUB.Requests.Users.Majstor;
global using MajstorHUB.Requests.Users.Korisnik;

global using MajstorHUB.Responses.Oglas;
global using MajstorHUB.Responses.Users;
global using MajstorHUB.Responses.Users.Firma;
global using MajstorHUB.Responses.Users.Majstor;
global using MajstorHUB.Responses.Users.Korisnik;

global using MajstorHUB.Services.FirmaService;
global using MajstorHUB.Services.KorisnikService;
global using MajstorHUB.Services.MajstorService;
global using MajstorHUB.Services.OglasService;
global using MajstorHUB.Services.PosaoService;
global using MajstorHUB.Services.PrijavaService;
global using MajstorHUB.Services.RecenzijaService;


global using MajstorHUB.Swagger;

global using Utlity;