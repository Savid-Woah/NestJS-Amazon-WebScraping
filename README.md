# My Wishlist 💌

🕸️ Webscraping en tiempo real - TypeScript | NestJS | Prisma | PostgreSQL | Jest | NextJS

🎥 Youtube Video: https://www.youtube.com/watch?v=AZaGqNDK9UM

## Tabla de Contenido

- [Consideraciones Antes de Empezar](#antes-de-empezar)
  - [IDE](#ide)
  - [Extensiones](#extensiones)
  - [Testing](#testing)
  - [ChronJob](#chron-job)
  - [Seguridad](#seguridad)
  - [Optimizaciones](#optimizaciones)
- [Guía de instalación](#getting-started)
  - [Pre-requisitos](#pre-requisitos)
  - [Instalación](#instalacion)
    - [Frontend](#front-end)
    - [Backend - Local](#back-end-local)
    - [Backend - Docker](#back-end-docker)
- [Errores](#errores)
- [License](#license)

## Consideraciones Antes de Empezar

Procedo a dar aclaraciones sobre:

### IDE

El IDE utilizado para este proyecto fue Visual Studio Code

### Extensiones

**NO se hizo uso de ESLINT ni de PRETTIER**. Esta vez opté por seguir las buenas
practicas de Clean Code (Robert C. Martin), me gusta encargarme de la estética de mi código manualmente.

**Instrucción**: Deshabilite las extensiones mencionadas arriba y elimine los archivos
relacionados a ellas en caso de hallarlos dentro del directorio raíz del proyecto.

**Disclaimer**: Esto lo hago en proyectos personales, a nivel corporativo me ajusto a los estándares por los que opte el equipo.

### Testing

El MCDC Coverage no fue especificado. Sin embargo, las pruebas unitarias necesarias fueron incluidas, haciendo uso de Jest y de prácticas de TDD (Test Driven Development). 

En vistas de que no fueron provistos los RPS (Request per Second) ni los DAU (Daily Active Users), las pruebas de performance no fueron realizadas.

### ChronJob

El servicio de WebScraping es una tarea programada, por defecto se encuentra configurada para ser ejecutada cada **30 segundos**. Este valor fuede ser modificado en el archivo
ScrapingService.ts en la linea 39.

⚠️ **Advertencia**: Asginar un tiempo muy corto puede llegar a incurrir en errores, esto debido a que no estamos aplicando conceptos de concurrencia vía multi-threading, y en algún punto puede que puppeteer encuentre conflictos si no ha terminado una tarea y tiene que comenzar con otra.

### Seguridad

El sistema cuenta con 2 sistemas de autenticación, la nativa integrada por el sistema
y la otra tipo oAuth2.0 con Google y/o Facebook

El sistema cumple con los estándares de encriptación AES (Advanced Encryption Standard)

### Optimizaciones

El sistema se ajusta a los requisitos, no se dieron requisitos de RPS (Request per Second)
ni DAU (Daily Active Users). Sin embargo, una optimización clara a futuro está relacionada con el uso de un set en nuestro servicio de WebScraping para la evicción de notificaciones duplicadas. Esta desición fue tomada para evitar una llamada extra a la base de datos pero, con una cantidad de usuarios muy excesiva, podría llegar a ocupar un espacio en memoria considerable.

## Guía de Instalación

A continuación las intrucciones para poner el proyecto en marcha.

### Pre-Requisitos

Asegurate de tener instalado lo siguiente en tu entorno local:
- IDE
- Node.js v20.12.0
- npm (Node.js package manager)
- Docker - (preferiblemente versión de escritorio: https://docs.docker.com/engine/install/ )
- PostgreSQL (en caso de querer correr el backend local):
    - usuario: postgres
    - contraseña: password
    - puerto: 5432
    - Disclaimer: en caso de tener una configuracion diferente
      asegurate de actualizar la variable de entorno DATABASE_URL
      encontrada en el archivo .env del proyecto

### Instalación - Puesta en marcha

#### Frontend: Instalación - Puesta en marcha

- Clona el repositorio: git clone https://github.com/Savid-Woah/NextJS-Amazon-WebScraping

- Abre el proyecto en tu IDE

- Añade al directorio raíz del proyecto los archivos .env del frontend adjuntos en el correo electrónico enviado con la prueba técnica

- Corre los siguientes comandos:

        - npm install
        - npm run dev

- Accede en tu navegador: http://localhost:3000

#### Backend: Instalación - Verificación

- Clona el repositorio: git clone https://github.com/Savid-Woah/NestJS-Amazon-WebScraping

- Abre el proyecto en tu IDE (otra ventana)

- Añade al directorio raíz del proyecto los archivos .env y .env.dev del backend adjuntos en el correo electrónico enviado con la prueba técnica

- Abre una terminal tipo GitBash dentro del IDE

- Instala las dependencias de npm => npm install

- Corre los comandos necesarios para las migraciones

- npx prisma generate

- npx prisma migrate reset

- npx prisma migrate deploy
        
- Corre los test => npm test

####  Backend: Puesta en marcha en Local

- Dentro de la consola GitBash correr el siguente comando => npm start dev

- El servidor correra en: http://localhost:3001

#### Backend: Puesta en marcha en Docker

- Inicializa Docker o Abre Docker Desktop (preferiblemente)
    
- En la consola de GitBash corre el siguiente comando => bash start-dev.sh

- El backend se encargará de levantar el contenedor de Docker con el servidor

    Nota: Este proceso puede tardar varios minutos, sugerimos revisar el estado 
    de los contenedores en la interfaz gráfica de Docker Desktop.

    ... una vez levantado el contenedor ...

- El servidor correra en: http://localhost:3001

### Todo listo!

- Con el frontend y el backend corriendo dirígete a la url del frontend: http://localhost:3000

- Empieza a anotar tus deseos 🌠

### Errores

- OOPS_ERROR:
    - código: 500
    - mensaje: 'oops-error'
    - causa: Error de servidor
- INVALID_CREDENTIALS:
    - código: 401
    - mensaje: 'invalid-credentials'
    - causa: Credenciales inválidas o inexistentes
- USER_NOT_FOUND:
    - código: 404
    - mensaje: 'user-not-found'
    - causa: No se encontró el usuario con el id especificado
- PRODUCT_NOT_FOUND:
    - código: 404
    - mensaje: 'product-not-found'
    - causa: No se encontró el producto con el id especificado
- PERSISTENCE_EXCEPTION:
    - código: 500
    - mensaje: 'persistence-exception'
    - causa: Error de interacción con la base de datos
