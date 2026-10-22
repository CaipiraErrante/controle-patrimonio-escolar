FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--proxy-config", "proxy.conf.docker.json"]
