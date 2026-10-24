# Sistema de Controle de Patrimônio Escolar

Aplicação full-stack, open source e em desenvolvimento para cadastro e gestão
dos bens patrimoniais de uma instituição de ensino. O objetivo é permitir
consultar, cadastrar, editar e excluir bens, acompanhando seus dados,
localização, estado de conservação e responsáveis.

> O frontend Angular inclui login com Django Allauth e telas para consultar,
> cadastrar, editar e excluir as quatro categorias de patrimônio disponíveis
> na API.

## Tecnologias e serviços

O ambiente local é composto por três serviços executados com Docker Compose:

| Serviço | Tecnologia | Responsabilidade |
| --- | --- | --- |
| `frontend` | Angular 22, TypeScript 6, Node.js 22 e Angular CLI | Aplicação web e servidor de desenvolvimento com recarga automática. |
| `backend` | Python 3.14, Django 6.1, Django REST Framework e Django Allauth | APIs de negócio, autenticação e administração. |
| `db` | PostgreSQL 18 | Persistência relacional. |

Os serviços não são microserviços independentes: são os componentes da
arquitetura da aplicação, orquestrados localmente pelo Docker Compose. O código
do frontend e do backend é montado como bind mount durante o desenvolvimento.

## Documentação das tecnologias

- [Angular](https://angular.dev/overview)
- [Angular CLI](https://angular.dev/tools/cli)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Node.js](https://nodejs.org/docs/latest/api/)
- [npm](https://docs.npmjs.com/)
- [Python](https://docs.python.org/3/)
- [Django](https://docs.djangoproject.com/en/6.1/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Allauth — Headless](https://docs.allauth.org/en/latest/headless/)
- [Especificação OpenAPI do Allauth Headless](https://docs.allauth.org/en/latest/headless/openapi-specification/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Docker Engine para Linux](https://docs.docker.com/engine/install/)

## Pré-requisitos

Para executar a aplicação pelo caminho recomendado, instale:

- Git;
- Docker com Docker Compose;
- navegador web.

Para executar o Angular diretamente no workstation, instale também Node.js 22
e npm 11. Não é necessário instalar Python ou PostgreSQL para o modo
Docker Compose.

### Windows

1. Instale o [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/)
   e habilite o backend WSL 2.
2. Instale o Git.
3. Para executar o Angular fora do Docker, instale Node.js 22.
4. Clone o repositório e abra a pasta do projeto no PowerShell ou no terminal
   WSL.

### Linux

1. Instale Git e [Docker Engine](https://docs.docker.com/engine/install/) com o
   plugin Docker Compose.
2. Configure as permissões para executar Docker conforme a documentação da
   distribuição.
3. Para executar o Angular fora do Docker, instale Node.js 22.
4. Clone o repositório e abra a pasta do projeto em um terminal.

## Configuração e execução com Docker Compose

Os comandos a seguir são executados na raiz do repositório.

1. Crie o arquivo `.env` a partir do exemplo.

   **PowerShell:**

   ```powershell
   Copy-Item .env-example .env
   ```

   **Linux, WSL ou Git Bash:**

   ```bash
   cp .env-example .env
   ```

2. Edite `.env` e defina uma senha de banco e uma chave secreta próprias.
   Não compartilhe nem publique esse arquivo.
3. Construa as imagens e inicie os serviços:

   ```bash
   docker compose up --build -d
   ```

   Na primeira execução, o comando instala as dependências. O frontend usa
   bind mount para refletir alterações locais sem rebuild. Se as dependências
   do Angular mudarem em `package.json` ou `package-lock.json`, reconstrua a
   imagem com:

   ```bash
   docker compose up --build -d frontend
   ```

4. Confira o estado e os logs:

   ```bash
   docker compose ps
   docker compose logs -f backend
   docker compose logs -f frontend
   ```

5. Acesse:

   - Aplicação Angular: [http://localhost](http://localhost)
   - API Django e interface navegável do REST Framework:
     [http://localhost:8000](http://localhost:8000)
   - Administração Django: [http://localhost:8000/admin/](http://localhost:8000/admin/)

As migrações do banco são executadas ao iniciar o backend. Para criar um
superusuário administrativo:

```bash
docker compose exec backend python manage.py createsuperuser
```

Para parar os serviços sem remover os dados do banco:

```bash
docker compose down
```

O volume `postgres_data` persiste os dados entre reinicializações.

## Desenvolvimento do Angular diretamente no workstation (opcional)

É possível executar o backend e o banco no Docker e o servidor Angular
diretamente no Windows ou Linux. Primeiro, configure `.env` conforme a seção
anterior e inicie o backend e o banco:

```bash
docker compose up --build -d backend
```

Esse comando também inicia o serviço `db`, exigido pelo backend. Em outro
terminal, na raiz do projeto, instale as dependências e inicie o Angular:

```bash
cd frontend-angular
npm ci
npm start -- --proxy-config proxy.conf.local.json
```

Abra [http://localhost:4200](http://localhost:4200). O proxy local encaminha
as requisições do Allauth para o backend em `localhost:8000`. As alterações no
código Angular são recarregadas automaticamente.

## APIs e rotas

### Django REST Framework — API de negócio

As rotas do DRF são incluídas na raiz do backend, sem prefixo `/api/`. A
interface navegável do DRF está disponível em
[http://localhost:8000](http://localhost:8000). Recursos registrados:

| Recurso | Endpoint |
| --- | --- |
| Usuários | `/users/` |
| Grupos | `/groups/` |
| Bens móveis | `/bens_moveis/` |
| Bens imóveis | `/bens_imoveis/` |
| Bens semoventes | `/bens_semoventes/` |
| Bens imateriais | `/bens_imateriais/` |

Por exemplo, a lista de bens móveis pode ser consultada em
[http://localhost:8000/bens_moveis/](http://localhost:8000/bens_moveis/).
Os endpoints de patrimônio exigem autenticação e permissões de modelo do
Django. A interface browsable também disponibiliza os endpoints de sessão em
`/api-auth/`. Os endpoints `/users/` e `/groups/` são restritos a usuários
administrativos (`is_staff`).

## Permissões do inventário

A API usa as permissões padrão de modelo do Django para os bens. Conceda aos
usuários ou grupos as permissões `view`, `add`, `change` e `delete` para cada
categoria necessária. O usuário administrativo criado com `createsuperuser`
pode atribuir essas permissões no Django Admin, em **Authentication and
Authorization → Groups** ou **Users**.

### Django Allauth — autenticação Headless

As rotas Headless estão sob `/_allauth/`. O frontend acessa a API Browser em:

- `GET /_allauth/browser/v1/config` — configuração da autenticação e cookie
  CSRF;
- `POST /_allauth/browser/v1/auth/login` — login com usuário e senha;
- `GET /_allauth/browser/v1/auth/session` — consulta o estado da sessão;
- `DELETE /_allauth/browser/v1/auth/session` — encerra a sessão.

Com o Compose, o endereço de configuração é
[http://localhost/_allauth/browser/v1/config](http://localhost/_allauth/browser/v1/config).
Consulte a [documentação Headless](https://docs.allauth.org/en/latest/headless/)
e a [especificação OpenAPI](https://docs.allauth.org/en/latest/headless/openapi-specification/)
para os demais endpoints e formatos.

## Testes

Na pasta `frontend-angular`, execute os testes e o build:

```bash
npm test
npm run build
```

Com os serviços Docker Compose em execução, execute os testes do backend:

```bash
docker compose exec backend python manage.py test
```
## Estrutura do repositório

```text
backend/             API Django, configuração e migrações
frontend-angular/    aplicação Angular
compose.yaml         serviços locais do frontend, backend e banco
.env-example         modelo de variáveis de ambiente
```

## Contribuições

Contribuições são bem-vindas. Antes de abrir uma alteração, descreva o
problema ou a melhoria, mantenha as credenciais fora do repositório e execute
os testes relevantes para as partes modificadas.
