using Microsoft.EntityFrameworkCore;
using ControlePatrimonio.Api.Data;
using ControlePatrimonio.Api.Models;
using ControlePatrimonio.Api.Repositories.Interfaces;

namespace ControlePatrimonio.Api.Repositories
{
    public class PatrimonioRepository : IPatrimonioRepository
    {
        private readonly AppDbContext _context;

        public PatrimonioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patrimonio>> GetAllAsync()
        {
            return await _context.Patrimonios.ToListAsync();
        }

        public async Task<Patrimonio?> GetByIdAsync(int id)
        {
            return await _context.Patrimonios.FindAsync(id);
        }

        public async Task AddAsync(Patrimonio patrimonio)
        {
            _context.Patrimonios.Add(patrimonio);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Patrimonio patrimonio)
        {
            _context.Entry(patrimonio).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Patrimonio patrimonio)
        {
            _context.Patrimonios.Remove(patrimonio);
            await _context.SaveChangesAsync();
        }

        public bool Exists(int id)
        {
            return _context.Patrimonios.Any(e => e.Id == id);
        }
    }
}
