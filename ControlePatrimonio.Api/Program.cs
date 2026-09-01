using Microsoft.EntityFrameworkCore;
using ControlePatrimonio.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// MySQL connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var mysqlHost = builder.Configuration["MYSQL_HOST"] ?? "127.0.0.1";
var mysqlPort = builder.Configuration["MYSQL_PORT"] ?? "3306";
var mysqlDatabase = builder.Configuration["MYSQL_DATABASE"] ?? "ControlePatrimonio";
var mysqlUser = builder.Configuration["MYSQL_USER"] ?? "patrimonio";
var mysqlPassword = builder.Configuration["MYSQL_PASSWORD"] ?? "patrimonio123";

if (builder.Configuration["MYSQL_DATABASE"] is not null ||
    builder.Configuration["MYSQL_USER"] is not null ||
    builder.Configuration["MYSQL_PASSWORD"] is not null ||
    builder.Configuration["MYSQL_PORT"] is not null ||
    builder.Configuration["MYSQL_HOST"] is not null)
{
    connectionString = $"Server={mysqlHost};Port={mysqlPort};Database={mysqlDatabase};User={mysqlUser};Password={mysqlPassword};";
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register Repositories
builder.Services.AddScoped<ControlePatrimonio.Api.Repositories.Interfaces.IUsuarioRepository, ControlePatrimonio.Api.Repositories.UsuarioRepository>();
builder.Services.AddScoped<ControlePatrimonio.Api.Repositories.Interfaces.IPatrimonioRepository, ControlePatrimonio.Api.Repositories.PatrimonioRepository>();

// Register Services
builder.Services.AddScoped<ControlePatrimonio.Api.Services.Interfaces.IAuthService, ControlePatrimonio.Api.Services.AuthService>();
builder.Services.AddScoped<ControlePatrimonio.Api.Services.Interfaces.IPatrimonioService, ControlePatrimonio.Api.Services.PatrimonioService>();

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

    if (!dbContext.Usuarios.Any())
    {
        dbContext.Usuarios.Add(new ControlePatrimonio.Api.Models.Usuario { Username = "admin", Password = "123" });
        dbContext.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
