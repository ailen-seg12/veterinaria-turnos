import ServicesRepository from '../repositories/services.repository.js';

class ServicesService {
  constructor(repository = new ServicesRepository()) {
    this.repository = repository;
  }

  async getServices(filters = {}) {
    const services = await this.repository.getAll();

    let result = services;

    if (filters.category) {
      result = result.filter(
        service => service.category === filters.category
      );
    }

    if (filters.available !== undefined) {
      const available =
        filters.available === true ||
        filters.available === 'true';

      result = result.filter(
        service => service.available === available
      );
    }

    return result;
  }

  async getServiceById(id) {
    const service = await this.repository.getById(id);

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    return service;
  }

  async createService(data) {
    const {
      name,
      description,
      duration,
      price,
      category,
      available
    } = data;

    if (
      !name ||
      !description ||
      !duration ||
      price === undefined ||
      !category ||
      available === undefined
    ) {
      throw new Error('Faltan campos obligatorios');
    }

    if (Number(price) < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    return this.repository.create({
      name,
      description,
      duration: Number(duration),
      price: Number(price),
      category,
      available: Boolean(available)
    });
  }

  async updateService(id, data) {
    const { id: ignoredId, ...updateData } = data;

    const updatedService = await this.repository.update(
      id,
      updateData
    );

    if (!updatedService) {
      throw new Error('Servicio no encontrado');
    }

    return updatedService;
  }

  async deleteService(id) {
    const service = await this.repository.getById(id);

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    return this.repository.delete(id);
  }
}

export default ServicesService;