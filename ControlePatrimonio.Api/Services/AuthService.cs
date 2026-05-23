using ControlePatrimonio.Api.Models;
using ControlePatrimonio.Api.Repositories.Interfaces;
using ControlePatrimonio.Api.Services.Interfaces;

namespace ControlePatrimonio.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public AuthService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<Usuario?> AuthenticateAsync(string username, string password)
        {
            // Qualquer regra de negócio adicional de autenticação viria aqui (ex: hash da senha)
            return await _usuarioRepository.GetByCredentialsAsync(username, password);
        }
    }
}
