import express from 'express';
import servicesRouter from './routes/services.router.js';

const app = express();

// Permite que Express lea JSON enviado en el body
app.use(express.json());
app.use('/api/services', servicesRouter);

// Ruta simple para comprobar que la API funciona
app.get('/', (req, res) => {
  res.json({
    message: 'API de veterinaria funcionando'
  });
});

export default app;