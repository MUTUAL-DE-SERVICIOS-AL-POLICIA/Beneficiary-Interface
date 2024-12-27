
FROM node:18-alpine AS base

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json yarn.lock ./

# Instala las dependencias
RUN yarn install --frozen-lockfile && yarn cache clean --network-timeout 600000

# Copia el resto del código del proyecto
COPY . .

# Exponer el puerto en el contenedor
EXPOSE 4002
# Comando por defecto para iniciar la aplicación
CMD ["yarn", "dev", "--turbo", "-p", "4000"]
