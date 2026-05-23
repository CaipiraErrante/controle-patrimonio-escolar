using Microsoft.AspNetCore.Mvc;
using ControlePatrimonio.Api.Services.Interfaces;

namespace ControlePatrimonio.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _authService.AuthenticateAsync(request.Username, request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos." });
            }

            return Ok(new { message = "Login realizado com sucesso", userId = user.Id });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
