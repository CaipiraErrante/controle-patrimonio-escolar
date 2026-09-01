# ETAPA 1: Compilação (Usa o SDK completo)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copia apenas o arquivo de projeto e restaura as dependências (otimiza o cache de camadas)
COPY *.csproj ./
RUN dotnet restore

# Copia o restante dos arquivos e compila a versão de produção
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# ETAPA 2: Produção (Usa apenas o Runtime leve)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copia os arquivos compilados da etapa anterior
COPY --from=build /app/publish .

# Informa a porta interna do container (padrão .NET 10 é 8080)
EXPOSE 8080

# Comando para iniciar a API
ENTRYPOINT ["dotnet", "ControlePatrimonio.Api.dll"]