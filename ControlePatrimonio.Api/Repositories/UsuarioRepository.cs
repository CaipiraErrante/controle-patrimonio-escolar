using Microsoft.EntityFrameworkCore;
using ControlePatrimonio.Api.Data;
using ControlePatrimonio.Api.Models;
using ControlePatrimonio.Api.Repositories.Interfaces;

namespace ControlePatrimonio.Api.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> GetByCredentialsAsync(string username, string password)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
        }
    }
}
