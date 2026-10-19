# Sistema de Controle de Patrimônio

Trabalho focado no desenvolvimento de um sistema completo (Fullstack) para gerenciamento de patrimônios e bens materiais de uma instituição de ensino.

## Objetivo

O sistema tem como objetivo permitir a realização de cadastro, visualização, atualização e exclusão (operações CRUD) de itens de patrimônio, mantendo o controle sobre as localizações, estados de conservação e respectivos responsáveis por cada bem.

## Tecnologias Utilizadas

### Frontend

* **Angular:** Framework para desenvolvimento web em typescript.

### Backend

* **Django:** Framework python utilizado para a API (Django REST_framework) e controle de usuários (AllAuth).

### Base da Dados

* **PostgreSQL:** Banco de dados relacional escolhido para armazenamento.

## Arquitetura do Backend

A API foi desenvolvida no padrão MVC, separando  as responsabilidades do código seguindo boas práticas de engenharia de software:

* **Controllers:** Camada de entrada (Endpoints). Recebem as requisições HTTP do frontend, chamam os serviços necessários e retornam as respostas.
* **Services:** Camada de negócio. Contêm as regras e lógicas específicas da aplicação.
* **Repositories:** Camada de dados (Padrão Repository). Centralizam as consultas e escritas no banco de dados, isolando o `AppDbContext` do restante da aplicação.
* **Models:** Entidades que representam as tabelas do banco de dados (`Usuario`, `Patrimonio`).

## Como Executar o Projeto

### 1. Requisitos

Antes de iniciar, verifique se o ambiente atende aos itens abaixo:

* Docker e Docker Compose instalados
* Acesso ao navegador para abrir a interface do sistema
* Python 3.14.4
* UV (Gestor de pacotes e ambiente virtual python)

### 2. Variáveis de ambiente

Na raiz do projeto, existe um arquivo `.env-example` com as variáveis usadas pelo PostgreSQL e pela aplicação:

```env
POSTGRES_DB=djangodb
POSTGRES_USER=django_user
POSTGRES_PASSWORD=django_password
```

Altere os valores e renomeie o arquivo para .env ***ANTES*** de realizar a instalação.

Essas informações também são usadas pelo arquivo `compose.yaml`.

### 3. Rodando com Docker Compose

A partir da raiz do projeto, execute:

```bash
docker compose up --build -d
```

Esse comando vai criar e iniciar:

* container do PostgreSQL na porta `5432`
* container do backend na porta `8000`
* container do frontend reservado para as portas `80` e `443`

Para verificar se os containers estão ativos:

```bash
docker compose ps
```

Para acompanhar os logs da API:

```bash
docker compose logs -f backend
```

Para parar os containers:

```bash
docker compose down
```

Para reiniciar os containers:

```bash
docker compose up -d --force-recreate
```

Para criar uma conta de superusuário:

```bash
docker compose exec -it backend sh # para acessar o container do backend

python manage.py createsuperuser # comando do django para criar o superusuário
```

### 4. Se tudo correr bem:

> A aplicação estará disponível em `http://localhost` (porta `80`).

> A API poderá ser consultada e testada em `http://localhost:8000`.

> A área de administração do Django poderá ser acessada em `http://localhost:8000/admin`.

### 5. Ambiente de desenvolvimento:

As instruções dos itens 3 e 4 são suficientes para a instalação do sistema em máquina local para avaliação e testes.

Para desenvolvimento, é recomendável configurar um ambiente virtual com alguma ferramenta como o pip (padrão do python) ou uv (recomendado) para facilitar o desenvolvimento.

O Docker `compose.yaml` foi configurado com o uso de volumes "bind mount" para faciliar o desenvolvimento (não é recessário recompilar as imagens ao fazer alterações nos arquivos locais).

**Para o backend:**

As dependências do python (para o backend, por hora) estão fixadas no arqvivo `requirements.txt`.

**Para o frontend:**

O sistema utiliza duas API's: Uma para os dados do negócio (gestão de bens patrimoniais) e outra exclusiva para autenticação e controle de acesso aos recursos do sistema pelos usuários.

As especificações da API dos dados do negócio podem ser consultadas na própria aplicação, no endereço `http://localhost:8000`

Já as especificações da API dos usuários estão publicadas em: https://docs.allauth.org/en/latest/headless/openapi-specification/

## 👥 Funcionalidades Implementadas:

* [x] Interface moderna e responsiva (Login, Inventário e Formulário de Cadastro).
* [x] Autenticação básica via banco de dados.
* [x] Leitura e Listagem dinâmica dos patrimônios do banco.
* [x] Criação de novos patrimônios.
* [x] Edição de patrimônios existentes (reutilizando a tela de cadastro).
* [x] Exclusão de itens diretamente do inventário.