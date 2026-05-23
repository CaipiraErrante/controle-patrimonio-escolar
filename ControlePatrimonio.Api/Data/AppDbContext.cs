using Microsoft.EntityFrameworkCore;
using ControlePatrimonio.Api.Models;

namespace ControlePatrimonio.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Patrimonio> Patrimonios { get; set; } = null!;
    }
}
