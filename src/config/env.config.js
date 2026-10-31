import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
  throw new Error('Falta la variable de entorno PORT');
}

if (!process.env.NODE_ENV) {
  throw new Error('Falta la variable de entorno NODE_ENV');
}

if (!process.env.MONGO_URI) {
  throw new Error('Falta la variable de entorno MONGO_URI');
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI
};

export default config;