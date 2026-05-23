using ControlePatrimonio.Api.Models;

namespace ControlePatrimonio.Api.Repositories.Interfaces
{
    public interface IPatrimonioRepository
    {
        Task<IEnumerable<Patrimonio>> GetAllAsync();
        Task<Patrimonio?> GetByIdAsync(int id);
        Task AddAsync(Patrimonio patrimonio);
        Task UpdateAsync(Patrimonio patrimonio);
        Task DeleteAsync(Patrimonio patrimonio);
        bool Exists(int id);
    }
}
