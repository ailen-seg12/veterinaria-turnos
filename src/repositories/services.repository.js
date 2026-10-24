import ServicesDAO from '../dao/services.dao.js';

class ServicesRepository {
  constructor(dao = new ServicesDAO('./src/data/services.json')) {
    this.dao = dao;
  }

  async getAll() {
    return this.dao.getAll();
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async create(data) {
    return this.dao.create(data);
  }

  async update(id, data) {
    return this.dao.update(id, data);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}

export default ServicesRepository;