import express from 'express';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';

import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();

// Permite leer JSON enviado en el body
app.use(bodyParser.json());

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


// Archivos públicos: CSS y JavaScript del navegador
app.use(express.static('./src/public'));

// Rutas de la API
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/views', viewsRouter);

// Ruta simple para comprobar que la API funciona
app.get('/', (req, res) => {
  res.json({
    message: 'API de veterinaria funcionando'
  });
});

export default app;