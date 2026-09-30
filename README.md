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
- dotenv
- JavaScript
- JSON

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install