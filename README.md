# Veterinaria Turnos

Sistema backend para la gestión de servicios y reservas de una veterinaria.

## Descripción

Este proyecto implementa una aplicación backend desarrollada con Node.js y Express.

La aplicación cuenta con una API REST para administrar servicios y reservas, persistencia en MongoDB Atlas mediante Mongoose, vistas renderizadas desde el servidor con Handlebars y comunicación en tiempo real mediante Socket.IO.

Los principales recursos del sistema son:

- `services`: servicios disponibles de la veterinaria.
- `bookings`: reservas realizadas por los clientes.
- `messages`: modelo preparado para almacenar mensajes.

La aplicación utiliza una arquitectura en capas para separar responsabilidades:

- **Routes:** definen los endpoints y los conectan con los controllers.
- **Controllers:** reciben las solicitudes HTTP y coordinan las respuestas.
- **Services:** contienen las reglas de negocio.
- **Repositories:** funcionan como intermediarios entre los services y los DAO.
- **DAO:** realizan el acceso a MongoDB utilizando los modelos de Mongoose.
- **Models:** definen los esquemas utilizados para almacenar la información.
- **Views:** permiten visualizar información del sistema mediante Handlebars.

La API REST y las vistas conviven dentro del mismo proyecto.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Handlebars
- express-handlebars
- Socket.IO
- dotenv
- body-parser
- JavaScript
- HTML
- CSS

---

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

---

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

La aplicación primero establece la conexión con MongoDB Atlas y luego inicia el servidor HTTP utilizado por Express y Socket.IO.

---

# Arquitectura

El flujo principal para el acceso a datos es:

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

Las vistas utilizan la misma arquitectura existente y no acceden directamente a la base de datos.

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
- generan respuestas JSON o renderizan vistas.

## Services

Los services contienen las reglas de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

- validar datos obligatorios;
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

---

# Models

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

Si se agrega nuevamente el mismo servicio a una reserva, se incrementa su `quantity`.

## Message

El modelo de mensajes contiene:

- `user`
- `message`

También utiliza `timestamps`.

---

# API REST

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

Ejemplo:

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

# Vistas con Handlebars

Handlebars se utiliza como motor de vistas de Express.

Las vistas permiten visualizar información real almacenada en MongoDB sin reemplazar la API REST.

## Listado de servicios

```http
GET /views/services
```

Muestra los servicios almacenados en MongoDB incluyendo:

- nombre;
- descripción;
- duración;
- precio;
- categoría;
- disponibilidad.

Los datos pasan por la arquitectura existente:

```text
views.router
  ↓
views.controller
  ↓
ServicesService
  ↓
Repository
  ↓
DAO
  ↓
Mongoose
  ↓
MongoDB
```

## Disponibilidad

```http
GET /views/availability
```

Muestra los servicios que se encuentran disponibles.

No existen datos hardcodeados dentro de las vistas.

---

# Comunicación en tiempo real con Socket.IO

Socket.IO permite mantener comunicación entre el servidor y los navegadores conectados.

La aplicación utiliza un servidor HTTP compartido por Express y Socket.IO.

Cuando se crea un nuevo servicio mediante:

```http
POST /api/services
```

el servicio se almacena primero en MongoDB.

Luego el servidor obtiene la lista actualizada y emite el evento:

```text
servicesUpdated
```

mediante Socket.IO.

El navegador escucha ese evento desde:

```text
src/public/js/socket.js
```

y actualiza dinámicamente la lista de servicios.

El flujo es:

```text
POST /api/services
       ↓
Controller
       ↓
Service
       ↓
Repository
       ↓
DAO
       ↓
MongoDB
       ↓
io.emit('servicesUpdated')
       ↓
socket.js
       ↓
Actualización del HTML
```

De esta manera, un nuevo servicio puede aparecer en:

```text
/views/services
```

sin necesidad de recargar manualmente la página.

---

# Handlebars y Socket.IO

Handlebars realiza el renderizado inicial de la información desde el servidor.

Socket.IO permite reflejar cambios posteriores en tiempo real.

Por ejemplo:

```text
MongoDB
   ↓
Handlebars
   ↓
Vista inicial
```

Luego:

```text
Acción real del sistema
   ↓
Socket.IO
   ↓
Evento
   ↓
JavaScript del navegador
   ↓
Actualización de una parte de la vista
```

Las vistas no reemplazan a la API REST. Ambas funcionalidades conviven dentro del mismo proyecto.

---

# Persistencia

La aplicación utiliza MongoDB Atlas como base de datos.

La conexión se configura mediante:

```env
MONGO_URI
```

Mongoose se encarga de:

- conectar la aplicación con MongoDB;
- definir esquemas;
- validar datos;
- realizar operaciones CRUD;
- gestionar ObjectId;
- establecer referencias entre documentos.

---

# Estructura principal

```text
src/
├── config/
│   ├── database.config.js
│   └── env.config.js
├── controllers/
│   ├── bookings.controller.js
│   ├── services.controller.js
│   └── views.controller.js
├── dao/
│   ├── models/
│   │   ├── booking.model.js
│   │   ├── message.model.js
│   │   └── service.model.js
│   ├── bookings.dao.js
│   └── services.dao.js
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── socket.js
├── repositories/
│   ├── bookings.repository.js
│   └── services.repository.js
├── routes/
│   ├── bookings.router.js
│   ├── services.router.js
│   └── views.router.js
├── services/
│   ├── bookings.service.js
│   └── services.service.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── availability.handlebars
│   └── services.handlebars
├── app.js
└── server.js
```

---

# Pruebas realizadas

Se verificó el funcionamiento de:

```text
GET  /api/services
GET  /api/services/:sid
POST /api/services
PUT  /api/services/:sid
DELETE /api/services/:sid

POST /api/bookings
GET  /api/bookings/:bid
POST /api/bookings/:bid/services/:sid

GET /views/services
GET /views/availability
```

También se comprobó que, al crear un nuevo servicio mediante la API, la vista `/views/services` se actualiza automáticamente mediante Socket.IO sin recargar la página.

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