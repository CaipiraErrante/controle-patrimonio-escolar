# Sistema de Controle de Patrimônio

Trabalho focado no desenvolvimento de um sistema completo (Fullstack) para gerenciamento de patrimônios e bens materiais de uma instituição de ensino.

## Objetivo

O sistema tem como objetivo permitir a realização de cadastro, visualização, atualização e exclusão (operações CRUD) de itens de patrimônio, mantendo o controle sobre as localizações, estados de conservação e respectivos responsáveis por cada bem.

## Tecnologias Utilizadas

### Frontend

* **HTML5:** Estrutura das páginas de login, inventário e cadastro.
* **CSS3:** Estilização própria com design moderno, cores agradáveis e pequenas interações (hover e animações de focus).
* **JavaScript:** Lógica de manipulação do DOM e integração assíncrona (via `fetch`) com a API do backend.

### Backend

* **C# .NET 10 (Web API):** Servidor RESTful para processamento das requisições.
* **Entity Framework Core (Pomelo MySQL):** Mapeamento Objeto-Relacional (ORM) para abstração do banco de dados.
* **MySQL:** Banco de dados relacional escolhido para armazenar os usuários e patrimônios.

## Arquitetura do Backend

A API foi desenvolvida no padrão MVC, separando  as responsabilidades do código seguindo boas práticas de engenharia de software:

* **Controllers:** Camada de entrada (Endpoints). Recebem as requisições HTTP do frontend, chamam os serviços necessários e retornam as respostas.
* **Services:** Camada de negócio. Contêm as regras e lógicas específicas da aplicação.
* **Repositories:** Camada de dados (Padrão Repository). Centralizam as consultas e escritas no banco de dados, isolando o `AppDbContext` do restante da aplicação.
* **Models:** Entidades que representam as tabelas do banco de dados (`Usuario`, `Patrimonio`).

## Como Executar o Projeto

### Requisitos

Antes de iniciar, verifique se o ambiente atende aos itens abaixo:

* Docker e Docker Compose instalados
* (Opcional, para execução local sem container) .NET 10 SDK instalado
* Acesso ao navegador para abrir a interface do sistema

### 1. Arquivo de ambiente

Na raiz do projeto, existe um arquivo `.env` com as variáveis usadas pelo MySQL e pela aplicação:

```env
MYSQL_DATABASE=ControlePatrimonio
MYSQL_USER=patrimonio
MYSQL_PASSWORD=patrimonio123
MYSQL_ROOT_PASSWORD=root123
MYSQL_PORT=3306
```

Essas informações também são usadas pelo arquivo `compose.yaml` para subir os containers do banco e da API.

### 2. Rodando com Docker Compose (recomendado)

A partir da raiz do projeto, execute:

```bash
docker compose up --build -d
```

Esse comando vai criar e iniciar:

* container do MySQL na porta `3306`
* container da API na porta `8080`

Para verificar se os containers estão ativos:

```bash
docker compose ps
```

Para acompanhar os logs da API:

```bash
docker compose logs -f api
```

Para parar os containers:

```bash
docker compose down
```

Para reiniciar os containers:

```bash
docker compose up -d --force-recreate
```

> A aplicação estará disponível em `http://localhost:8080`

### 3. Rodando o Frontend

O frontend foi feito com arquivos estáticos simples.

1. Acesse a raiz do projeto.
2. Abra o arquivo `login.html` no seu navegador.
3. Se o banco de dados acabou de ser criado, faça login utilizando as seguintes credenciais padrão que a API injeta automaticamente:
   * **Usuário:** `admin`
   * **Senha:** `123`

### 4. Execução local sem Docker

Se preferir rodar a API manualmente, utilize o ambiente local do .NET:

```bash
set -a
source .env
set +a
cd ControlePatrimonio.Api
dotnet ef database update
dotnet run
```

> O backend local normalmente fica em `http://localhost:5228` ou conforme a configuração do projeto.

## 👥 Funcionalidades Implementadas

* [x] Interface moderna e responsiva (Login, Inventário e Formulário de Cadastro).
* [x] Autenticação básica via banco de dados.
* [x] Leitura e Listagem dinâmica dos patrimônios do banco.
* [x] Criação de novos patrimônios.
* [x] Edição de patrimônios existentes (reutilizando a tela de cadastro).
* [x] Exclusão de itens diretamente do inventário.
