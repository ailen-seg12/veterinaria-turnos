import BookingsDAO from '../dao/bookings.dao.js';

class BookingsRepository {
  constructor(dao = new BookingsDAO()) {
    this.dao = dao;
  }

  async create(data) {
    return this.dao.create(data);
  }

  async getAll() {
    return this.dao.getAll();
  }

  async getByDate(date) {
    return this.dao.getByDate(date);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  // Cuenta cuántas reservas tienen asociado un servicio
  async countByServiceId(serviceId) {
    return this.dao.countByServiceId(serviceId);
  }

  async update(id, data) {
    return this.dao.update(id, data);
  }
}

export default BookingsRepository;