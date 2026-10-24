import BookingsDAO from '../dao/bookings.dao.js';

class BookingsRepository {
  constructor(dao = new BookingsDAO('./src/data/bookings.json')) {
    this.dao = dao;
  }

  async create(data) {
    return this.dao.create(data);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async update(id, data) {
    return this.dao.update(id, data);
  }
}

export default BookingsRepository;