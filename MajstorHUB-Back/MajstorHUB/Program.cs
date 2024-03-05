using MajstorHUB.Models;
using MajstorHUB.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Specialized;

var builder = WebApplication.CreateBuilder(args);
//Generise swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

//Moguce izmene
builder.Services.Configure<MajstorHUBDatabaseSettings>(builder.Configuration.GetSection(nameof(MajstorHUBDatabaseSettings)));
//Pravili su interfejs i za bazu smatram da nema razloga za to ali proveriti
builder.Services.AddSingleton(sp=>sp.GetRequiredService<IOptions<MajstorHUBDatabaseSettings>>().Value);
//Valjda pribavlja konekcioni string jebem li ga
builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(builder.Configuration.GetValue<string>("MajstorHUBDatabaseSettings:ConnectionString")));
builder.Services.AddScoped<IKorisnikService, KorisnikService>();
builder.Services.AddScoped<IFirmaService, FirmaService>();


var app = builder.Build();
app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
    options.DocumentTitle = "Swagger";
});

//app.MapGet("/", () => "Hello World!");

app.Run();