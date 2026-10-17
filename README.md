# Veterinaria Turnos

Sistema backend para la gestión de servicios y reservas de una veterinaria.

## Descripción

Este proyecto implementa una API REST desarrollada con Node.js y Express.

La aplicación permite administrar dos recursos principales:

- `services`: servicios disponibles de la veterinaria.
- `bookings`: reservas realizadas por los clientes.

La información se guarda en archivos JSON utilizando FileSystem, por lo que los datos se conservan aunque el servidor se reinicie.

La API está organizada separando responsabilidades en tres partes principales:

- **Routes:** definen los endpoints disponibles.
- **Controllers:** reciben las solicitudes HTTP, procesan `req.params`, `req.query` y `req.body`, llaman a los managers y generan las respuestas.
- **Managers:** contienen la lógica de datos y administran la persistencia mediante archivos JSON.

Esta organización permite mantener el proyecto modular y preparado para seguir creciendo.

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

La aplicación sigue el siguiente flujo:

```text
Cliente
   ↓
Router
   ↓
Controller
   ↓
Manager
   ↓
Archivo JSON
```

### Routes

Los routers únicamente definen los endpoints y los conectan con sus controllers correspondientes.

Ejemplo:

```js
router.get('/:sid', getServiceById);
```

### Controllers

Los controllers:

- reciben la petición;
- leen `req.params`, `req.query` y `req.body`;
- llaman al manager correspondiente;
- controlan las respuestas HTTP;
- utilizan `res.status().json()`.

Los controllers no realizan acceso directo a los archivos JSON.

### Managers

Los managers:

- contienen la lógica relacionada con los datos;
- leen y escriben archivos JSON mediante FileSystem;
- crean, buscan, actualizan y eliminan recursos;
- no utilizan `req` ni `res`.

---

# Servicios

Cada servicio contiene:

- `id`
- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

El campo `id` se genera automáticamente.

## Obtener todos los servicios

```http
GET /api/services
```

También permite filtrar por categoría:

```http
GET /api/services?category=consulta
```

Y por disponibilidad:

```http
GET /api/services?available=true
```

## Obtener un servicio por ID

```http
GET /api/services/:sid
```

Ejemplo:

```http
GET /api/services/1
```

Respuestas posibles:

- `200` si el servicio existe.
- `404` si el servicio no existe.

## Crear un servicio

```http
POST /api/services
```

Ejemplo de body:

```json
{
  "name": "Vacunacion",
  "description": "Aplicacion de vacuna",
  "duration": 20,
  "price": 12000,
  "category": "consulta",
  "available": true
}
```

El `id` no se envía desde el body porque se genera automáticamente.

Respuestas posibles:

- `201` si el servicio se crea correctamente.
- `400` si faltan campos obligatorios.

## Actualizar un servicio

```http
PUT /api/services/:sid
```

Ejemplo:

```http
PUT /api/services/1
```

Body:

```json
{
  "price": 18000,
  "available": false
}
```

El `id` original del servicio se conserva y no puede modificarse.

Respuestas posibles:

- `200` si el servicio fue actualizado.
- `404` si el servicio no existe.

## Eliminar un servicio

```http
DELETE /api/services/:sid
```

Ejemplo:

```http
DELETE /api/services/1
```

Respuestas posibles:

- `200` si el servicio fue eliminado.
- `404` si el servicio no existe.

---

# Reservas

Cada reserva contiene:

- `id`
- `clientName`
- `clientEmail`
- `date`
- `time`
- `status`
- `services`

El campo `id` se genera automáticamente.

La propiedad `services` contiene las referencias a los servicios asociados a la reserva.

Ejemplo:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si se agrega nuevamente el mismo servicio a una reserva, no se duplica el objeto. Se incrementa el valor de `quantity`.

## Crear una reserva

```http
POST /api/bookings
```

Ejemplo de body:

```json
{
  "clientName": "Juan Perez",
  "clientEmail": "juan@mail.com",
  "date": "2026-10-20",
  "time": "10:00",
  "status": "pendiente"
}
```

La reserva se crea inicialmente con:

```json
"services": []
```

Respuesta esperada:

```text
201 Created
```

## Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

Ejemplo:

```http
GET /api/bookings/1
```

Respuestas posibles:

- `200` si la reserva existe.
- `404` si la reserva no existe.

## Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Ejemplo:

```http
POST /api/bookings/1/services/2
```

En este ejemplo:

- `1` es el ID de la reserva.
- `2` es el ID del servicio.

Antes de agregar el servicio se valida:

- que la reserva exista;
- que el servicio exista mediante `ServiceManager`.

La primera vez se guarda:

```json
{
  "service": 2,
  "quantity": 1
}
```

Si se vuelve a agregar el mismo servicio:

```json
{
  "service": 2,
  "quantity": 2
}
```

---

# Persistencia de datos

La aplicación utiliza FileSystem mediante:

```js
import fs from 'fs/promises';
```

Los servicios se almacenan en:

```text
src/data/services.json
```

Las reservas se almacenan en:

```text
src/data/bookings.json
```

Para leer los archivos se utiliza `fs.readFile()` y para guardar los cambios se utiliza `fs.writeFile()`.

Los datos JSON se convierten a objetos o arrays de JavaScript mediante:

```js
JSON.parse()
```

Antes de guardarlos nuevamente se convierten a JSON mediante:

```js
JSON.stringify()
```

De esta forma, los datos permanecen almacenados incluso después de reiniciar el servidor.

---

# Estructura del proyecto

```text
src/
├── config/
│   └── env.config.js
│
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
│
├── managers/
│   ├── ServiceManager.js
│   └── BookingManager.js
│
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
│
├── data/
│   ├── services.json
│   └── bookings.json
│
├── app.js
└── server.js

package.json
package-lock.json
.env.example
.gitignore
README.md
```

## Controllers

`services.controller.js` contiene las funciones HTTP relacionadas con servicios:

```text
getServices()
getServiceById()
createService()
updateService()
deleteService()
```

`bookings.controller.js` contiene las funciones HTTP relacionadas con reservas:

```text
createBooking()
getBookingById()
addServiceToBooking()
```

Los controllers son los encargados de trabajar con `req` y `res`.

## Managers

`ServiceManager` administra la persistencia y las operaciones relacionadas con los servicios:

```text
getServices()
getServiceById()
addService()
updateService()
deleteService()
```

`BookingManager` administra la persistencia y las operaciones relacionadas con las reservas:

```text
createBooking()
getBookingById()
addServiceToBooking()
```

Los managers no utilizan `req` ni `res`.

## Routers

Los archivos:

```text
services.router.js
bookings.router.js
```

definen únicamente los endpoints de la API y los conectan con sus controllers.

No contienen lógica de acceso a archivos JSON.

---

# Archivos no incluidos en el repositorio

El repositorio no incluye:

```text
node_modules/
.env
.vscode/
```

Estos archivos y carpetas se encuentran excluidos mediante `.gitignore`.

## Persistencia comprobada

Los datos almacenados en `services.json` y `bookings.json` permanecen guardados después de detener y volver a iniciar el servidor.

## Organización comprobada

La API mantiene los mismos endpoints de las entregas anteriores, pero ahora las responsabilidades se encuentran separadas entre:

```text
Routes → Controllers → Managers → JSON
```

Esta estructura facilita el mantenimiento y prepara el proyecto para futuras etapas del curso.