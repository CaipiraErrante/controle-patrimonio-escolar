using Microsoft.AspNetCore.Mvc;
using ControlePatrimonio.Api.Models;
using ControlePatrimonio.Api.Services.Interfaces;

namespace ControlePatrimonio.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatrimoniosController : ControllerBase
    {
        private readonly IPatrimonioService _service;

        public PatrimoniosController(IPatrimonioService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patrimonio>>> GetPatrimonios()
        {
            var patrimonios = await _service.GetAllAsync();
            return Ok(patrimonios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patrimonio>> GetPatrimonio(int id)
        {
            var patrimonio = await _service.GetByIdAsync(id);

            if (patrimonio == null)
            {
                return NotFound();
            }

            return Ok(patrimonio);
        }

        [HttpPost]
        public async Task<ActionResult<Patrimonio>> PostPatrimonio(Patrimonio patrimonio)
        {
            var created = await _service.CreateAsync(patrimonio);
            return CreatedAtAction(nameof(GetPatrimonio), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatrimonio(int id, Patrimonio patrimonio)
        {
            var result = await _service.UpdateAsync(id, patrimonio);
            
            if (!result)
            {
                return BadRequest("Não foi possível atualizar o patrimônio. Verifique se o ID está correto e existe.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatrimonio(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
