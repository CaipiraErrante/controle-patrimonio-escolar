#!/bin/sh

echo "Aguardando o banco de dados PostgreSQL iniciar completamente..."
# Executa um loop rápido tentando testar a conexão antes de disparar o Django
until python -c "import os, psycopg; conn = psycopg.connect(host=os.environ.get('POSTGRES_HOST', 'db'), port=os.environ.get('POSTGRES_PORT', '5432'), dbname=os.environ['POSTGRES_DB'], user=os.environ['POSTGRES_USER'], password=os.environ['POSTGRES_PASSWORD']); conn.close()" 2>/dev/null; do
  echo "Banco de dados ainda indisponível - aguardando..."
  sleep 1
done

echo "Banco de dados pronto! Iniciando rotinas do Django..."

# python manage.py collectstatic --noinput
python manage.py makemigrations --noinput
python manage.py migrate --noinput
echo "Iniciando o servidor de desenvolvimento..."
python manage.py runserver 0.0.0.0:8000