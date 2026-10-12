# Veterinaria Turnos

Sistema backend para la gestión de servicios y reservas de una veterinaria.

## Descripción

Este proyecto implementa una API REST desarrollada con Node.js y Express.

La aplicación permite administrar dos recursos principales:

- `services`: servicios disponibles de la veterinaria.
- `bookings`: reservas realizadas por los clientes.

La información se guarda en archivos JSON utilizando FileSystem, por lo que los datos se conservan aunque el servidor se reinicie.

La lógica de cada recurso se encuentra separada en managers:

- `ServiceManager`
- `BookingManager`

Las rutas de la API se manejan mediante `express.Router()`.

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

La propiedad `services` contiene los servicios asociados a la reserva.

Ejemplo:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si se agrega nuevamente el mismo servicio a una reserva, no se duplica el objeto, sino que aumenta el valor de `quantity`.

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

Antes de agregar el servicio se valida que existan tanto la reserva como el servicio.

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

y antes de guardarlos nuevamente se convierten a JSON mediante:

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
├── data/
│   ├── services.json
│   └── bookings.json
│
├── managers/
│   ├── ServiceManager.js
│   └── BookingManager.js
│
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
│
├── app.js
└── server.js

package.json
package-lock.json
.env.example
.gitignore
README.md
```

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

## Archivos no incluidos en el repositorio

El repositorio no incluye:

```text
node_modules/
.env
.vscode/
```

Estos archivos y carpetas se encuentran excluidos mediante `.gitignore`.

## Persistencia comprobada

Los datos almacenados en `services.json` y `bookings.json` permanecen guardados después de detener y volver a iniciar el servidor.