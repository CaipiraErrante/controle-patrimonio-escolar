# Sistema de Controle de Patrimônio Escolar

Aplicação full-stack para cadastro, consulta, atualização e exclusão de bens
patrimoniais de uma instituição de ensino.

## Tecnologias

- Frontend: Angular 22, TypeScript 6 e Node.js 22.
- Backend: Python 3.14, Django 6.1, Django REST Framework e Django Allauth.
- Banco de dados: MySQL 8.4.
- Ambiente local: Docker Compose.

## Requisitos

- Git;
- Docker com Docker Compose;
- navegador web.

Para executar o Angular fora do Docker, instale também Node.js 22 e npm 11.

## Configuração

Na raiz do repositório, copie o arquivo de exemplo:

```powershell
Copy-Item .env-example .env
```

Edite `.env` e substitua as senhas e `DJANGO_SECRET_KEY` por valores próprios.
Não publique nem compartilhe esse arquivo. `MYSQL_PORT_HOST` define a porta
MySQL acessível pelo computador; se necessário, altere `3307` para uma porta
livre.

## Executar com Docker Compose

Na raiz do projeto:

### Banco MySQL já existente neste projeto

O banco já inicializado contém as tabelas `bem`, `localizacao`,
`movimentacao`, `setor` e `tipo_bem`, enquanto o histórico antigo do Django
não corresponde aos arquivos de migração do backend atual. A migração
`0005_unified_inventory` valida as tabelas existentes e não as recria nem
remove; se o esquema estiver incompleto ou diferente, ela para com erro.

Antes de atualizar, faça um backup recente. Para reconciliar o histórico desse
banco existente, execute os comandos abaixo na raiz do projeto, nesta ordem.
O primeiro apenas registra as migrações antigas como aplicadas, sem executar
seu SQL; use-o **somente** para o banco existente com o esquema novo já
presente. Em uma instalação nova, não use `--fake`.

```powershell
docker compose build backend
docker compose run --rm --no-deps backend python manage.py migrate api 0004_restore_big_auto_fields --fake
docker compose run --rm --no-deps backend python manage.py migrate
```

Se qualquer comando de migração falhar, não inicie o restante dos serviços nem
apague o volume. Guarde a mensagem de erro e o backup para investigar.

### Iniciar os serviços

Para a base existente, execute esta etapa somente depois que os comandos acima
terminarem com sucesso. Em uma instalação nova, pode iniciar diretamente:

```powershell
docker compose up --build -d
docker compose ps
docker compose logs -f backend
```

A aplicação fica em `http://localhost:8080` por padrão (configure
`FRONTEND_PORT` no `.env` para usar outra porta), a API Django em
`http://localhost:8000` e o Django Admin em `http://localhost:8000/admin/`.
Para criar um usuário administrador:

```powershell
docker compose exec backend python manage.py createsuperuser
```

O MySQL persiste os dados no volume `mysql_data`. `docker compose down` para os
serviços sem apagar esse volume. **Não use `docker compose down -v`** se quiser
preservar o banco.

## API e cadastros iniciais

O inventário usa `/bens/`; os catálogos usam `/tipos_bem/` e `/setores/`.
Antes de cadastrar bens pelo frontend, crie pelo Django Admin pelo menos um
tipo de bem e um setor. As movimentações e localizações estão disponíveis em
`/movimentacoes/` e `/localizacoes/`.

O backend executa as migrações ao iniciar. A migração que substitui o modelo
antigo mantém as tabelas legadas no banco, mas **não importa automaticamente
registros delas para o novo inventário**. Confirme que não há registros que
precisem ser convertidos e mantenha um backup válido antes de iniciar o
backend em uma base existente.
