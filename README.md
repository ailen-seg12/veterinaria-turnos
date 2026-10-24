# Veterinaria Turnos

Sistema backend para la gestión de servicios y reservas de una veterinaria.

## Descripción

Este proyecto implementa una API REST desarrollada con Node.js y Express.

La aplicación permite administrar dos recursos principales:

- `services`: servicios disponibles de la veterinaria.
- `bookings`: reservas realizadas por los clientes.

La información se guarda actualmente en archivos JSON utilizando FileSystem, por lo que los datos se conservan aunque el servidor se reinicie.

La API utiliza una arquitectura en capas para separar responsabilidades:

- **Routes:** definen los endpoints y los conectan con los controllers.
- **Controllers:** reciben las solicitudes HTTP, leen `req.params`, `req.query` y `req.body`, llaman a los services y generan las respuestas HTTP.
- **Services:** contienen las reglas de negocio de la aplicación.
- **Repositories:** funcionan como intermediarios entre los services y los DAO.
- **DAO:** realizan el acceso directo a los archivos JSON mediante FileSystem.
- **Data:** contiene los archivos donde actualmente se persisten los datos.

Esta organización permite mantener el proyecto modular y prepara la aplicación para futuras migraciones de persistencia, como MongoDB y Mongoose.

## Tecnologías utilizadas

- Node.js
- Express
- body-parser
- dotenv
- JavaScript
- FileSystem (`fs/promises`)
- JSON

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
```

## Ejecutar el proyecto

Modo normal:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

El servidor se ejecuta por defecto en:

```text
http://localhost:8080
```

---

# Arquitectura de la API

La aplicación utiliza el siguiente flujo:

```text
Cliente
  ↓
Router
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
Archivo JSON
```

Cada capa tiene una responsabilidad específica.

## Routes

Los routers definen los endpoints disponibles y los conectan con las funciones correspondientes de los controllers.

Ejemplo:

```js
router.get('/:sid', getServiceById);
```

Los routers no contienen reglas de negocio ni acceso directo a archivos JSON.

## Controllers

Los controllers:

- reciben las solicitudes HTTP;
- leen `req.params`, `req.query` y `req.body`;
- llaman al service correspondiente;
- manejan códigos de estado HTTP;
- devuelven respuestas mediante `res.status().json()`.

Los controllers son la única capa que trabaja directamente con `req` y `res`.

No realizan acceso directo a archivos JSON.

## Services

Los services contienen las reglas de negocio de la aplicación.

Por ejemplo:
