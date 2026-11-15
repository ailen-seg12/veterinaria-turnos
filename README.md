# Veterinaria Turnos

Sistema backend para la gestión de servicios y reservas de una veterinaria.

## Descripción

Este proyecto implementa una aplicación backend desarrollada con Node.js y Express.

La aplicación cuenta con:

- API REST para administrar servicios y reservas.
- Persistencia en MongoDB Atlas mediante Mongoose.
- Arquitectura en capas.
- Vistas renderizadas con Handlebars.
- Comunicación en tiempo real mediante Socket.IO.
- Consultas avanzadas con filtros, paginación y ordenamiento.
- Validaciones de datos con Zod.
- Relaciones entre reservas y servicios mediante ObjectId y `populate()`.

Los principales recursos del sistema son:

- `services`: servicios disponibles de la veterinaria.
- `bookings`: reservas realizadas por los clientes.
- `messages`: modelo preparado para almacenar mensajes.

---

# Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod
- Handlebars
- express-handlebars
- Socket.IO
- dotenv
- body-parser
- JavaScript
- HTML
- CSS

---

# Instalación

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
MONGO_URI=tu_uri_de_mongodb
```

El archivo `.env` contiene información sensible y no debe subirse al repositorio.

---

# Ejecutar el proyecto

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

La aplicación primero establece la conexión con MongoDB Atlas y luego inicia el servidor HTTP utilizado por Express y Socket.IO.

---

# Arquitectura

La aplicación utiliza una arquitectura en capas:

```text
Cliente
  ↓
Router
  ↓
Middleware de validación
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
Mongoose Model
  ↓
MongoDB Atlas
```

Cada capa tiene una responsabilidad específica.

## Routes

Los routers definen los endpoints disponibles y los conectan con los controllers.

Las rutas no contienen lógica de negocio ni realizan acceso directo a MongoDB.

## Middlewares

Los middlewares de validación comprueban los datos antes de que lleguen a los controllers.

Se utilizan para validar:

- `req.body`
- `req.params`

Si los datos son inválidos, la API devuelve:

```text
400 Bad Request
```

antes de realizar operaciones en MongoDB.

## Controllers

Los controllers:

- reciben las solicitudes HTTP;
- leen `req.params`, `req.query` y `req.body`;
- llaman al service correspondiente;
- manejan códigos de estado HTTP;
- generan respuestas JSON o renderizan vistas.

## Services

Los services contienen las reglas de negocio.

Entre sus responsabilidades se encuentran:

- verificar que existan servicios y reservas;
- agregar servicios a reservas;
- incrementar la cantidad cuando un servicio ya se encuentra agregado;
- construir filtros;
- calcular la paginación;
- definir las opciones de ordenamiento.

## Repositories

Los repositories funcionan como intermediarios entre los services y los DAO.

## DAO

Los DAO realizan el acceso a MongoDB mediante los modelos de Mongoose.

Entre sus operaciones se encuentran:

- búsqueda de documentos;
- creación;
- actualización;
- eliminación;
- paginación;
- ordenamiento;
- conteo de documentos;
- `populate()`.

## Models

Los modelos definen los esquemas de Mongoose utilizados para almacenar la información en MongoDB.

---

# Modelos

Los modelos se encuentran en:

```text
src/dao/models/
```

Modelos disponibles:

```text
service.model.js
booking.model.js
message.model.js
```

## Service

Un servicio contiene:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

MongoDB genera automáticamente el campo `_id`.

También se utilizan `createdAt` y `updatedAt` mediante `timestamps`.

## Booking

Una reserva contiene:

- `clientName`
- `clientEmail`
- `date`
- `time`
- `status`
- `services`

Los servicios asociados se almacenan mediante referencias de MongoDB:

```text
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

El campo `service` referencia un documento de la colección `services`.

No se guarda el objeto completo del servicio dentro de la reserva.

Si se agrega nuevamente el mismo servicio a