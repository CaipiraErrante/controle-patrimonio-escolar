# Sistema de Controle de Patrimônio

Trabalho focado no desenvolvimento de um sistema completo (Fullstack) para gerenciamento de patrimônios e bens materiais de uma instituição de ensino.

##  Objetivo
O sistema tem como objetivo permitir a realização de cadastro, visualização, atualização e exclusão (operações CRUD) de itens de patrimônio, mantendo o controle sobre as localizações, estados de conservação e respectivos responsáveis por cada bem.

##  Tecnologias Utilizadas

### Frontend
* **HTML5:** Estrutura das páginas de login, inventário e cadastro.
* **CSS3:** Estilização própria com design moderno, cores agradáveis e pequenas interações (hover e animações de focus).
* **JavaScript:** Lógica de manipulação do DOM e integração assíncrona (via `fetch`) com a API do backend.

### Backend
* **C# .NET 10 (Web API):** Servidor RESTful para processamento das requisições.
* **Entity Framework Core (Pomelo MySQL):** Mapeamento Objeto-Relacional (ORM) para abstração do banco de dados.
* **MySQL:** Banco de dados relacional escolhido para armazenar os usuários e patrimônios.

##  Arquitetura do Backend
A API foi desenvolvida no padrão MVC, separando  as responsabilidades do código seguindo boas práticas de engenharia de software:

- **Controllers:** Camada de entrada (Endpoints). Recebem as requisições HTTP do frontend, chamam os serviços necessários e retornam as respostas.
- **Services:** Camada de negócio. Contêm as regras e lógicas específicas da aplicação.
- **Repositories:** Camada de dados (Padrão Repository). Centralizam as consultas e escritas no banco de dados, isolando o `AppDbContext` do restante da aplicação.
- **Models:** Entidades que representam as tabelas do banco de dados (`Usuario`, `Patrimonio`).

##  Como Executar o Projeto

### Pré-requisitos
* [MySQL Server] instalado e rodando.
* [.NET 10 SDK] ou superior instalado na máquina.

### 1. Configurando o Banco de Dados
1. Abra o arquivo `ControlePatrimonio.Api/appsettings.json`.
2. Altere as propriedades da `"DefaultConnection"` colocando o seu usuário e senha do MySQL local, caso necessário.

### 2. Rodando o Backend (API)
Abra um terminal (PowerShell ou CMD) na pasta da API (`ControlePatrimonio.Api`) e execute os comandos abaixo para criar as tabelas no MySQL automaticamente e iniciar o servidor:

```bash

dotnet ef database update
dotnet run

```
> ### O servidor estará rodando no endereço `http://localhost:5228`.

### 3. Rodando o Frontend
O frontend foi feito com arquivos estáticos simples. 
1. Acesse a raiz da pasta do projeto.
2. Abra o arquivo `login.html` no seu navegador.
3. Se o banco de dados acabou de ser criado, faça login utilizando as seguintes credenciais padrão que a API injeta automaticamente:
   - **Usuário:** `admin`
   - **Senha:** `123`

## 👥 Funcionalidades Implementadas
- [x] Interface moderna e responsiva (Login, Inventário e Formulário de Cadastro).
- [x] Autenticação básica via banco de dados.
- [x] Leitura e Listagem dinâmica dos patrimônios do banco.
- [x] Criação de novos patrimônios.
- [x] Edição de patrimônios existentes (reutilizando a tela de cadastro).
- [x] Exclusão de itens diretamente do inventário.
