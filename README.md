# Veterinaria Turnos

Sistema backend para la gestión de servicios de una veterinaria.

## Descripción

Este proyecto implementa una API REST con Express para administrar los servicios disponibles de una veterinaria.

La lógica de los servicios se encuentra separada en `ServiceManager`, mientras que las rutas de la API se manejan mediante `express.Router()`.

Actualmente se incluyen como servicios iniciales:

- Control
- Consulta

Cada servicio contiene:

- id
- name
- description
- duration
- price
- category
- available

## Tecnologías utilizadas

- Node.js
- Express
- body-parser
- dotenv
- JavaScript
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

El servidor se ejecuta en:

```text
http://localhost:8080
```

## Endpoints

### Obtener todos los servicios

```http
GET /api/services
```

Permite filtrar por categoría:

```http
GET /api/services?category=consulta
```

También permite filtrar por disponibilidad:

```http
GET /api/services?available=true
```

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

Ejemplo:

```http
GET /api/services/1
```

- `200` si el servicio existe.
- `404` si no existe.

### Crear un servicio

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

El `id` se genera automáticamente.

- `201` si el servicio se crea correctamente.
- `400` si faltan campos obligatorios.

### Actualizar un servicio

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

El `id` del servicio no puede modificarse.

- `200` si el servicio existe.
- `404` si no existe.

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

Ejemplo:

```http
DELETE /api/services/1
```

- `200` si el servicio se elimina correctamente.
- `404` si no existe.

## Estructura del proyecto

```text
src/
├── config/
│   └── env.config.js
├── data/
│   └── services.json
├── managers/
│   └── ServiceManager.js
├── routes/
│   └── services.router.js
├── app.js
└── server.js

package.json
.env.example
.gitignore
README.md
```

## Archivos no incluidos en el repositorio

El repositorio no incluye:

- `node_modules`
- `.env`
- `.vscode`

Estos archivos se encuentran excluidos mediante `.gitignore`.