using ControlePatrimonio.Api.Models;

namespace ControlePatrimonio.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<Usuario?> AuthenticateAsync(string username, string password);
    }
}
