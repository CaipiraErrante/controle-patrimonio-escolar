#!/bin/sh
set -eu

echo "Banco de dados MySQL pronto! Iniciando rotinas do Django..."

python manage.py migrate --noinput
python manage.py shell -c "from django.contrib.auth import get_user_model; from rest_framework.authtoken.models import Token; import os; user = get_user_model().objects.order_by('id').first(); token = os.environ.get('DEBEZIUM_AUTH_TOKEN'); Token.objects.update_or_create(user=user, defaults={'key': token}) if user and token else print('Usuário ou DEBEZIUM_AUTH_TOKEN ausente; criação do token ignorada.')"

echo "Iniciando o servidor de desenvolvimento..."
python manage.py runserver 0.0.0.0:8000
