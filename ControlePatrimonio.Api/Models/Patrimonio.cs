namespace ControlePatrimonio.Api.Models
{
    public class Patrimonio
    {
        public int Id { get; set; }
        public string NumeroPatrimonio { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Localizacao { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public string Responsavel { get; set; } = string.Empty;
    }
}
