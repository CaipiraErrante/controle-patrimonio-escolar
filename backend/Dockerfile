# Usa uma imagem oficial do Python
FROM python:3.14-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

EXPOSE 8000

# Evita que o Python grave os arquivos .pyc no disco
ENV PYTHONDONTWRITEBYTECODE=1
# Garante que a saída do console seja exibida imediatamente
ENV PYTHONUNBUFFERED=1

# Copia o código do projeto
COPY . /app/

# Instala as dependências
RUN pip install --no-cache-dir -r requdocker compose up -d db backenddocker compose up -d db backendirements.txt && \
    chmod +x /app/scripts/commands.sh

CMD ["sh", "/app/scripts/commands.sh"]