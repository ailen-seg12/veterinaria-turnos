# Veterinaria Turnos

Sistema backend para la gestión de servicios y reservas de una veterinaria.

## Descripción

Este proyecto implementa una API REST desarrollada con Node.js y Express.

La aplicación permite administrar los siguientes recursos:

- `services`: servicios disponibles de la veterinaria.
- `bookings`: reservas realizadas por los clientes.
- `messages`: modelo preparado para almacenar mensajes.

La persistencia de datos se realiza utilizando MongoDB Atlas mediante Mongoose.

La API utiliza una arquitectura en capas para separar responsabilidades:

- **Routes:** definen los endpoints y los conectan con los controllers.
- **Controllers:** reciben las solicitudes HTTP, leen `req.params`, `req.query` y `req.body`, llaman a los services y generan las respuestas HTTP.
- **Services:** contienen las reglas de negocio de la aplicación.
- **Repositories:** funcionan como intermediarios entre los services y los DAO.
- **DAO:** realizan el acceso a los datos utilizando los modelos de Mongoose.
- **Models:** definen los esquemas utilizados para almacenar la información en MongoDB.

Esta organización permite mantener el proyecto modular y separar la lógica de negocio de la persistencia de datos.

## Tecnologías utilizadas

- Node.js
- Express
- Mongoose
- MongoDB Atlas
- dotenv
- body-parser
- JavaScript

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
MONGO_URI=tu_uri_de_mongodb
```

El archivo `.env` contiene información sensible y no debe subirse al repositorio.

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
Mongoose Model
  ↓
MongoDB Atlas
```

Cada capa tiene una responsabilidad específica.

## Routes

Los routers definen los endpoints disponibles y los conectan con las funciones correspondientes de los controllers.

Ejemplo:

```js
router.get('/:sid', getServiceById);
```

Los routers no contienen reglas de negocio ni realizan acceso directo a MongoDB.

## Controllers

Los controllers:

- reciben las solicitudes HTTP;
- leen `req.params`, `req.query` y `req.body`;
- llaman al service correspondiente;
- manejan códigos de estado HTTP;
- devuelven respuestas mediante `res.status().json()`.

Los controllers son la capa que trabaja directamente con `req` y `res`.

## Services

Los services contienen las reglas de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

- validar los datos obligatorios;
- validar precios;
- verificar que existan servicios y reservas;
- agregar servicios a una reserva;
- incrementar la cantidad de un servicio cuando ya se encuentra agregado.

Los services no acceden directamente a MongoDB.

## Repositories

Los repositories funcionan como intermediarios entre los services y los DAO.

Su objetivo es desacoplar la lógica de negocio de la implementación concreta utilizada para persistir la información.

## DAO

Los DAO son responsables del acceso a MongoDB mediante los modelos de Mongoose.

Actualmente existen:

```text
src/dao/services.dao.js
src/dao/bookings.dao.js
```

Entre las operaciones realizadas se encuentran:

- búsqueda de documentos;
- creación;
- actualización;
- eliminación;
- validación de ObjectId.

## Models

Los esquemas de Mongoose se encuentran en:

```text
src/dao/models/
```

Modelos disponibles:

```text
service.model.js
booking.model.js
message.model.js
```

### Service

Un servicio contiene:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

MongoDB genera automáticamente el campo `_id`.

También se utilizan `createdAt` y `updatedAt` mediante `timestamps`.

### Booking

Una reserva contiene:

- `clientName`
- `clientEmail`
- `date`
- `time`
- `status`
- `services`

Los servicios de una reserva se almacenan mediante referencias de MongoDB:

```text
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

El campo `service` referencia un documento de la colección `services`.

Si se agrega nuevamente el mismo servicio a una reserva, se incrementa su `quantity`.

### Message

El modelo de mensajes contiene:

- `user`
- `message`

También utiliza `timestamps`.

---

# Endpoints

## Servicios

### Obtener todos los servicios

```http
GET /api/services
```

Permite filtros opcionales mediante query params:

```http
GET /api/services?category=consulta
```

```http
GET /api/services?available=true
```

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

El parámetro `sid` corresponde al `_id` generado por MongoDB.

### Crear un servicio

```http
POST /api/services
```

Ejemplo de body:

```json
{
  "name": "Control",
  "description": "Control general de la mascota",
  "duration": 30,
  "price": 15000,
  "category": "consulta",
  "available": true
}
```

### Actualizar un servicio

```http
PUT /api/services/:sid
```

Ejemplo:

```json
{
  "price": 18000
}
```

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

---

# Reservas

### Crear una reserva

```http
POST /api/bookings
```

Ejemplo:

```json
{
  "clientName": "Ailen Segovia",
  "clientEmail": "ailen@mail.com",
  "date": "2026-11-05",
  "time": "10:00",
  "status": "pendiente"
}
```

### Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

El parámetro `bid` corresponde al `_id` generado por MongoDB.

### Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Si el servicio todavía no se encuentra agregado, se incorpora con:

```json
{
  "quantity": 1
}
```

Si el mismo servicio ya existe dentro de la reserva, se incrementa su cantidad.

---

# Persistencia

La aplicación utiliza MongoDB Atlas como base de datos.

La conexión se configura mediante:

```env
MONGO_URI
```

Mongoose se encarga de:

- conectar la aplicación con MongoDB;
- definir los esquemas;
- validar los datos;
- realizar operaciones CRUD;
- gestionar los ObjectId;
- establecer referencias entre documentos.

La aplicación se conecta primero a MongoDB y luego inicia el servidor Express.

---

# Estructura principal

```text
src/
├── config/
│   ├── database.config.js
│   └── env.config.js
├── controllers/
│   ├── bookings.controller.js
│   └── services.controller.js
├── dao/
│   ├── models/
│   │   ├── booking.model.js
│   │   ├── message.model.js
│   │   └── service.model.js
│   ├── bookings.dao.js
│   └── services.dao.js
├── repositories/
│   ├── bookings.repository.js
│   └── services.repository.js
├── routes/
│   ├── bookings.router.js
│   └── services.router.js
├── services/
│   ├── bookings.service.js
│   └── services.service.js
├── app.js
└── server.js
```

---

# Seguridad

El proyecto incluye un archivo `.gitignore` para evitar subir información sensible o innecesaria:

```text
node_modules/
.env
.vscode/
```

El archivo `.env` no debe incluirse en el repositorio.

El archivo `.env.example` contiene únicamente variables de ejemplo sin credenciales reales.