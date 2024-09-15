# Usa la imagen base de Node.js 20
FROM node:20

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias dentro del contenedor
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Compila el código TypeScript
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]
