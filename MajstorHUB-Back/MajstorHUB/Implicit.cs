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

global using Swashbuckle.AspNetCore.SwaggerGen;

global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Mvc.Filters;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.Extensions.Options;
global using Microsoft.OpenApi.Models;
global using Microsoft.IdentityModel.Tokens;

global using MajstorHUB.Authorization;
global using MajstorHUB.Models;
global using MajstorHUB.Services;
global using MajstorHUB.Swagger;
global using Utlity;