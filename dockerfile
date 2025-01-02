# Etapa de desarrollo
FROM node:20-alpine AS dev

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración para la instalación de dependencias
COPY package.json yarn.lock ./

# Instalar las dependencias
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copiar el resto del código del proyecto
COPY . .

# Exponer el puerto 3002
EXPOSE 3002

# Comando para iniciar Next.js en modo desarrollo en el puerto 3002
CMD ["yarn", "dev", "-p", "3002"]
