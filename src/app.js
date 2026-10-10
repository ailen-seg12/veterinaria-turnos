import express from 'express';
import bodyParser from 'body-parser';
import servicesRouter from './routes/services.router.js';

const app = express();

// Permite leer JSON enviado en el body
app.use(bodyParser.json());

// Rutas de servicios
app.use('/api/services', servicesRouter);

// Ruta simple para comprobar que la API funciona
app.get('/', (req, res) => {
  res.json({
    message: 'API de veterinaria funcionando'
  });
});

export default app;