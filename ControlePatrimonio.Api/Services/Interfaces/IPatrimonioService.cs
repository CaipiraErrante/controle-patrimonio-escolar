using ControlePatrimonio.Api.Models;

namespace ControlePatrimonio.Api.Services.Interfaces
{
    public interface IPatrimonioService
    {
        Task<IEnumerable<Patrimonio>> GetAllAsync();
        Task<Patrimonio?> GetByIdAsync(int id);
        Task<Patrimonio> CreateAsync(Patrimonio patrimonio);
        Task<bool> UpdateAsync(int id, Patrimonio patrimonio);
        Task<bool> DeleteAsync(int id);
    }
}
