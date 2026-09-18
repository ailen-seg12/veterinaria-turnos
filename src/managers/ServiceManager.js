import fs from 'fs/promises';

class ServiceManager {

  constructor(path) {
    this.path = path;
  }

  async getServices() {
    const data = await fs.readFile(this.path, 'utf-8');

    return JSON.parse(data);
  }

  async getServiceById(id) {
    const services = await this.getServices();

    const service = services.find(service => service.id === id);

    return service || null;
  }

  async addService(serviceData) {
    const requiredFields = [
      'name',
      'description',
      'duration',
      'price',
      'category',
      'available'
    ];

    const missingField = requiredFields.find(
      field =>
        serviceData[field] === undefined ||
        serviceData[field] === null ||
        serviceData[field] === ''
    );

    if (missingField) {
      throw new Error(`Falta el campo obligatorio: ${missingField}`);
    }

    const services = await this.getServices();

    const newId =
      services.length === 0
        ? 1
        : Math.max(...services.map(service => service.id)) + 1;

    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    services.push(newService);

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return newService;
  }

  async updateService(id, updatedData) {
    const services = await this.getServices();

    const index = services.findIndex(service => service.id === id);

    if (index === -1) {
      return null;
    }

    const updatedService = {
      ...services[index],
      ...updatedData,
      id: services[index].id
    };

    services[index] = updatedService;

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return updatedService;
  }

  async deleteService(id) {
    const services = await this.getServices();

    const index = services.findIndex(service => service.id === id);

    if (index === -1) {
      return null;
    }

    const deletedService = services[index];

    services.splice(index, 1);

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return deletedService;
  }

}

export default ServiceManager;