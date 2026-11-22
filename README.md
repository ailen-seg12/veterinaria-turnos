# Veterinaria Turnos

API REST desarrollada con Node.js y Express para gestionar servicios veterinarios y reservas de turnos.

El proyecto utiliza MongoDB Atlas como persistencia principal y aplica una arquitectura en capas para separar rutas, controladores, lógica de negocio y acceso a datos.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod
- Handlebars
- Socket.IO
- JavaScript
- dotenv

## Arquitectura

El proyecto está organizado mediante la siguiente arquitectura:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
DAO
  ↓
Models
  ↓
MongoDB Atlas
```

Las responsabilidades se encuentran separadas:

- **Routes:** definen los endpoints y middlewares.
- **Controllers:** reciben las solicitudes HTTP y generan las respuestas.
- **Services:** contienen la lógica y reglas de negocio.
- **Repositories:** conectan los servicios con los DAO.
- **DAO:** realizan las operaciones sobre MongoDB.
- **Models:** definen los esquemas de Mongoose.
- **Middlewares:** realizan validaciones antes de procesar los datos.

## Servicios veterinarios

Cada servicio contiene:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

Ejemplos de servicios disponibles en el sistema:

- Consulta
- Control
- Castración
- Desparasitación

## Endpoints de servicios

### Obtener servicios

```http
GET /api/services
```

### Obtener un servicio

```http
GET /api/services/:sid
```

### Crear un servicio

```http
POST /api/services
```

### Actualizar un servicio

```http
PUT /api/services/:sid
```

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

## Consultas avanzadas

El endpoint:

```http
GET /api/services
```

permite utilizar los siguientes Query Params:

- `category`
- `available`
- `page`
- `limit`
- `sortBy`
- `order`

Ejemplo:

```http
GET /api/services?category=consulta&available=true&page=1&limit=10&sortBy=price&order=asc
```

La respuesta incluye los servicios encontrados y metadata de paginación:

```json
{
  "services": [],
  "pagination": {
    "totalResults": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0,
    "hasPrevPage": false,
    "hasNextPage": false
  }
}
```

## Reservas

Cada reserva contiene:

- `clientName`
- `clientEmail`
- `date`
- `time`
- `status`
- `services`

Una reserva nueva comienza automáticamente con estado:

```text
pendiente
```

## Endpoints de reservas

### Crear una reserva

```http
POST /api/bookings
```

Ejemplo:

```json
{
  "clientName": "Ailen Segovia",
  "clientEmail": "ailen@mail.com",
  "date": "2027-01-15",
  "time": "10:00"
}
```

### Consultar una reserva

```http
GET /api/bookings/:bid
```

### Asociar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

## Relación entre reservas y servicios

Las reservas almacenan referencias a los servicios utilizando `ObjectId`.

La estructura utilizada es:

```js
{
  service: ObjectId,
  quantity: Number
}
```

No se guarda una copia completa del servicio dentro de la reserva.

Esto evita duplicar información en MongoDB.

## Populate

Cuando se consulta una reserva mediante:

```http
GET /api/bookings/:bid
```

se utiliza:

```js
populate('services.service')
```

Esto permite obtener los datos completos del servicio asociado.

MongoDB continúa almacenando únicamente la referencia `ObjectId`.

## Validaciones con Zod

El proyecto utiliza Zod para validar la información antes de llegar a MongoDB.

Se validan:

- creación de servicios;
- actualización de servicios;
- creación de reservas;
- IDs de reserva y servicio;
- formato de email;
- fechas;
- horarios.

Cuando los datos son inválidos, la API devuelve:

```http
400 Bad Request
```

junto con información sobre el campo incorrecto.

## Reglas de negocio

### Servicio existente

Solo puede asociarse a una reserva un servicio previamente registrado.

### Servicio disponible

Un servicio solamente puede reservarse cuando:

```js
available === true
```

Si se encuentra deshabilitado, la operación devuelve:

```http
409 Conflict
```

### Un único veterinario

Para esta versión se considera que la veterinaria posee un único veterinario.

Por lo tanto, dos turnos no pueden ocupar el mismo período horario.

### Duración de los turnos

La duración de una reserva se calcula utilizando la duración de los servicios asociados.

Ejemplo:

```text
Control
Duración: 30 minutos

Reserva: 17:00
Horario ocupado: 17:00 → 17:30
```

### No superposición

No pueden existir reservas activas cuyos horarios se superpongan en la misma fecha.

Ejemplo:

```text
Reserva A: 17:00 → 17:30
Reserva B: 17:15 → 17:45
```

La Reserva B es rechazada.

### Turnos consecutivos

Sí se permite que un turno comience exactamente cuando termina otro.

```text
17:00 → 17:30
17:30 → 18:00
```

### Varios servicios

Si una reserva contiene varios servicios, las duraciones se utilizan para calcular el tiempo total ocupado.

### Quantity

Si el mismo servicio vuelve a agregarse a una reserva, se incrementa:

```text
quantity
```

La nueva duración resultante también debe respetar la disponibilidad horaria.

Si genera una superposición, la modificación se rechaza.

### Fecha válida

Las fechas utilizan el formato:

```text
YYYY-MM-DD
```

No se permiten:

- fechas inexistentes;
- fechas anteriores al día actual.

### Hora válida

Los horarios utilizan:

```text
HH:mm
```

y deben encontrarse entre:

```text
00:00 y 23:59
```

### Horarios pasados

Si se crea una reserva para el día actual, no puede utilizarse un horario que ya haya pasado.

### Estado inicial

El estado inicial siempre es:

```text
pendiente
```

El cliente no puede definir otro estado durante la creación.

### Protección del historial

Si un servicio ya está asociado a una reserva, no puede eliminarse físicamente.

El endpoint