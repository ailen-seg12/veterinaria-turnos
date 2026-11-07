import { createServer } from 'node:http';
import { Server } from 'socket.io';

import app from './app.js';
import config from './config/env.config.js';
import { connectDB } from './config/database.config.js';

const httpServer = createServer(app);

const io = new Server(httpServer);

// Dejamos Socket.IO disponible para los controllers
app.set('io', io);

// Escucha conexiones de clientes
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const startServer = async () => {
  await connectDB();

  httpServer.listen(config.port, () => {
    console.log(
      `Servidor funcionando en http://localhost:${config.port}`
    );
  });
};

startServer();