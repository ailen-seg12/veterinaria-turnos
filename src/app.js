import express from 'express';
import bodyParser from 'body-parser';
import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';

const app = express();

// Permite leer JSON enviado en el body
app.use(bodyParser.json());

// Rutas de servicios
app.use('/api/services', servicesRouter);

// Rutas de reservas
app.use('/api/bookings', bookingsRouter);

// Ruta simple para comprobar que la API funciona
app.get('/', (req, res) => {
  res.json({
    message: 'API de veterinaria funcionando'
  });
});

export default app;