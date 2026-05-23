using ControlePatrimonio.Api.Models;
using ControlePatrimonio.Api.Repositories.Interfaces;
using ControlePatrimonio.Api.Services.Interfaces;

namespace ControlePatrimonio.Api.Services
{
    public class PatrimonioService : IPatrimonioService
    {
        private readonly IPatrimonioRepository _repository;

        public PatrimonioService(IPatrimonioRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Patrimonio>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Patrimonio?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Patrimonio> CreateAsync(Patrimonio patrimonio)
        {
            // Validações de negócio entrariam aqui
            await _repository.AddAsync(patrimonio);
            return patrimonio;
        }

        public async Task<bool> UpdateAsync(int id, Patrimonio patrimonio)
        {
            if (id != patrimonio.Id) return false;

            if (!_repository.Exists(id)) return false;

            await _repository.UpdateAsync(patrimonio);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var patrimonio = await _repository.GetByIdAsync(id);
            if (patrimonio == null) return false;

            await _repository.DeleteAsync(patrimonio);
            return true;
        }
    }
}
