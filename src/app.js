import config from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const manager = new ServiceManager('./src/data/services.json');

const services = await manager.getServices();

console.log(`Entorno: ${config.nodeEnv}`);
console.log(`Puerto configurado: ${config.port}`);

console.log('Servicios disponibles:');
console.log(services);