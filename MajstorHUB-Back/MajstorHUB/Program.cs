var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = config["Jwt:Issuer"],
        ValidAudience = config["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        // po defaultu je 5 minuta, znaci da tajmer za validiranje tokena kasni 5 minuta
        // zbog testiranja je stavljen ovako
        ClockSkew = TimeSpan.Zero 
    };
});
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
builder.Services.AddControllers();

//Moguce izmene
builder.Services.Configure<MajstorHUBDatabaseSettings>(builder.Configuration.GetSection(nameof(MajstorHUBDatabaseSettings)));
builder.Services.AddSingleton(sp=>sp.GetRequiredService<IOptions<MajstorHUBDatabaseSettings>>().Value);
builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(builder.Configuration.GetValue<string>("MajstorHUBDatabaseSettings:ConnectionString")));
builder.Services.AddScoped<IKorisnikService, KorisnikService>();
builder.Services.AddScoped<IFirmaService, FirmaService>();
builder.Services.AddScoped<IMajstorService,MajstorService>();
builder.Services.AddScoped<IOglasService, OglasService>();
//Dok se ne dodaju sve metode ne moze
//builder.Services.AddScoped<IRecenzijaService, RecenzijaService>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
        options.DocumentTitle = "Swagger";
    });
}
app.MapControllers();
app.Run();