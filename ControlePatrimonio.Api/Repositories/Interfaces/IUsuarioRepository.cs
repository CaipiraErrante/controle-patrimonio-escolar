using ControlePatrimonio.Api.Models;

namespace ControlePatrimonio.Api.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> GetByCredentialsAsync(string username, string password);
    }
}
