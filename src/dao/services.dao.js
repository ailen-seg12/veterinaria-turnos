import fs from 'fs/promises';

class ServicesDAO {
  constructor(path) {
    this.path = path;
  }

  // Lee todos los servicios del archivo JSON
  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  // Busca un servicio por ID
  async getById(id) {
    const services = await this.getAll();

    return services.find(
      service => service.id === Number(id)
    ) || null;
  }

  // Guarda un nuevo servicio
  async create(data) {
    const services = await this.getAll();

    const maxId = services.reduce(
      (max, service) =>
        service.id > max ? service.id : max,
      0
    );

    const newService = {
      id: maxId + 1,
      ...data
    };

    services.push(newService);

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2),
      'utf-8'
    );

    return newService;
  }

  // Actualiza un servicio existente
  async update(id, data) {
    const services = await this.getAll();

    const index = services.findIndex(
      service => service.id === Number(id)
    );

    if (index === -1) {
      return null;
    }

    const currentService = services[index];

    services[index] = {
      ...currentService,
      ...data,
      id: currentService.id
    };

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2),
      'utf-8'
    );

    return services[index];
  }

  // Elimina un servicio
  async delete(id) {
    const services = await this.getAll();

    const index = services.findIndex(
      service => service.id === Number(id)
    );

    if (index === -1) {
      return null;
    }

    const deletedService = services[index];

    services.splice(index, 1);

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2),
      'utf-8'
    );

    return deletedService;
  }
}

export default ServicesDAO;