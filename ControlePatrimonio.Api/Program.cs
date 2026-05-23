using Microsoft.EntityFrameworkCore;
using ControlePatrimonio.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// MySQL connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
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
