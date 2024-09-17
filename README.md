# API Pokemon - Proyecto NestJS

Este proyecto es una API construida en NestJS que interactúa con la PokeAPI y utiliza MongoDB como base de datos. Además, incluye integración con SonarQube para análisis de código estático. La documentación de la API está disponible en Swagger en la siguiente ruta: [http://localhost:3000/api/pokemon/v1/docs](http://localhost:3000/api/pokemon/v1/docs), la cual podra ser accesible cuando se despliegue el proyecto.

## Descripcion general del proyecto

Este proyecto cuanta con 3 módulos: Auth, user o persona y pokemon.
En el primer módulo se puede generar tokens de acceso a las rutas protegidas del proyecto que se detallan en la documentacion de swagger y tambien se puede refrescar los tokens los cuales tienen una hora de duracion y estan generados con jwt.
Al levantar el proyecto valida si existe un usuario administrador generado y en caso contrario lo crea con las siguientes credenciales: 

```bash
{
    "email": "chema_013@hotmail.com",
    "password": "12345"
}
```

A su ves existen dos perfiles en el proyecto admin y user los cuales restringen ciertas rutas segun sea el caso y pérfil.

El módulo de usuarios o personas tiene toda la funcionalidad de crear, editar, ver y eliminar usuarios, asi como actualizar contraseña y agregar o eliminar pokemons y agregar o editar geolocalizacion al usuario.

Por último esta el módulo de pokemons que consulta directamente apipokemon y ahi podemos consultar pokemons individuales o en masa estas rutas no estan protegidas.

## Requisitos Previos

Antes de desplegar el proyecto localmente, asegúrate de tener instalados los siguientes programas en tu sistema:

- **Docker Desktop** (para gestionar contenedores)
- **Node.js v20**
- **npm v10**
- **Git**

## Despliegue Local del Proyecto

Existen dos caminos para desplegar localmente el proyecto:

### Camino 1: Uso de Docker Compose

1. **Renombrar el archivo de configuración**  
   Cambia el nombre del archivo `example.env` a `.env` en el directorio raíz del proyecto. Asegúrate de que las siguientes variables de entorno estén definidas correctamente en este archivo:

   ```bash
   CONTEXT_NAME="api/pokemon"
   VERSION="v1"
   TZ="America/Mexico_City"
   POKEAPI_URL='https://pokeapi.co'
   MONGOURI='mongodb+srv://chemaUser:5EyQXaLBYhGLv9hH@cluster0.pcdwu.mongodb.net/FMP?retryWrites=true&w=majority&appName=Cluster0'
   ADMIN_EMAIL='admin@example.com'
   ADMIN_PASSWORD='admin123'
   ```

2. **Preparar Docker Desktop**  
   Asegúrate de que Docker Desktop esté en funcionamiento.

3. **Ejecutar Docker Compose**  
   Ejecuta el siguiente comando para levantar el proyecto junto con una instacia embebida SonarQube:

   ```bash
   docker-compose up -d
   ```

   Esto levantará:

   - Una instancia de **SonarQube** en el puerto `9000`.
   - El proyecto de **API Pokemon** en el puerto `3000`.

   Podrás hacer peticiones a la API usando Postman (archivo adjunto) o a través de la documentación de Swagger en [http://localhost:3000/api/pokemon/v1/docs](http://localhost:3000/api/pokemon/v1/docs).

### Camino 2: Ejecución Manual

1. **Configurar variables de entorno**  
   Después de clonar el repositorio, abre una terminal `Git Bash` y ejecuta los siguientes comandos para agregar las variables de entorno:

   ```bash
   export CONTEXT_NAME="api/pokemon"
   export VERSION="v1"
   export TZ="America/Mexico_City"
   export PORT=3000
   export POKEAPI_URL='https://pokeapi.co'
   export MONGOURI='mongodb+srv://chemaUser:5EyQXaLBYhGLv9hH@cluster0.pcdwu.mongodb.net/FMP?retryWrites=true&w=majority&appName=Cluster0'
   export ADMIN_EMAIL='admin@example.com'
   export ADMIN_PASSWORD='admin123'
   ```

2. **Instalar dependencias**  
   En la misma terminal, instala las dependencias del proyecto ejecutando el siguiente comando:

   ```bash
   npm install
   ```

3. **Levantar el proyecto**

   - Para levantar el proyecto en modo desarrollo, ejecuta:
     ```bash
     npm run start:dev
     ```
   - Para levantarlo en modo productivo, ejecuta:
     ```bash
     npm start
     ```

4. **Probar el proyecto**  
   El proyecto estará disponible en el puerto `3000`. Puedes probarlo usando el Postman adjunto o accediendo a la documentación de Swagger en [http://localhost:3000/api/pokemon/v1/docs](http://localhost:3000/api/pokemon/v1/docs).

## SonarQube - Análisis de Código

Si deseas correr el análisis de SonarQube, sigue estos pasos:

### Camino 1: Usando la instancia de SonarQube de Docker Compose

1. **Ejecutar las pruebas unitarias**  
   Ejecuta el siguiente comando para ejecutar las pruebas unitarias y generar un reporte de cobertura:

   ```bash
   npm run test:cov
   ```

2. **Configurar SonarQube**

   - Accede a la instancia de SonarQube en [http://localhost:9000](http://localhost:9000).
   - Inicia sesión con las credenciales predeterminadas:
     - Usuario: `admin`
     - Contraseña: `admin`
   - Cambia la contraseña cuando te lo solicite.
   - Ve a tu perfil (`My Account`) y selecciona la opción `Security`. Genera un nuevo token en el apartado `Generate Tokens`. El token debe ser global y sin fecha de expiración.
   - Copia el token generado y pégalo en el archivo `sonar-project.properties` en la propiedad:
     ```bash
     sonar.login=TU_TOKEN_GENERADO
     ```

3. **Ejecutar el escaneo de SonarQube**  
   Una vez configurado, ejecuta el siguiente comando para correr el escaneo:

   ```bash
   sonar-scanner
   ```

   En el caso de que salga un error de que no existe el comando sonar-scanner, instalar de forma global sonar-scanner:
   ```bash
   npm install -g sonarqube-scanner
   ```

4. **Ver el reporte**  
   Accede nuevamente a SonarQube en [http://localhost:9000](http://localhost:9000) para ver el reporte de análisis.

### Camino 2: Usando otra instancia de SonarQube

1. **Pruebas Unitarias**  
   Ejecuta el siguiente comando:

   ```bash
   npm run test:cov
   ```

2. **Configurar SonarQube**  
   Si estás usando una instancia diferente de SonarQube, sigue el mismo procedimiento que en el **Camino 1** para generar un token en esa instancia y configurarlo en el archivo `sonar-project.properties`.

3. **Ejecutar el escaneo**  
   Ejecuta:

   ```bash
   sonar-scanner
   ```

   En el caso de que salga un error de que no existe el comando sonar-scanner, instalar de forma global sonar-scanner:
   ```bash
   npm install -g sonarqube-scanner
   ```

4. **Ver el reporte**  
   Accede a la instancia de SonarQube en la dirección correspondiente para ver el análisis.

## Notas adicionales

- Asegúrate de que Docker Desktop esté en ejecución antes de utilizar Docker Compose.
- Puedes modificar las variables de entorno según sea necesario para tu entorno específico.
