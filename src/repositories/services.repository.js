import ServicesDAO from '../dao/services.dao.js';

class ServicesRepository {
  constructor(dao = new ServicesDAO()) {
    this.dao = dao;
  }

  async getAll(filter = {}) {
    return this.dao.getAll(filter);
  }

  async getPaginated(options) {
    return this.dao.getPaginated(options);
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