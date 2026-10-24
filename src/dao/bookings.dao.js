import fs from 'fs/promises';

class BookingsDAO {
  constructor(path) {
    this.path = path;
  }

  // Lee todas las reservas
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

  // Busca una reserva por ID
  async getById(id) {
    const bookings = await this.getAll();

    return bookings.find(
      booking => booking.id === Number(id)
    ) || null;
  }

  // Crea una reserva
  async create(data) {
    const bookings = await this.getAll();

    const maxId = bookings.reduce(
      (max, booking) =>
        booking.id > max ? booking.id : max,
      0
    );

    const newBooking = {
      id: maxId + 1,
      ...data
    };

    bookings.push(newBooking);

    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2),
      'utf-8'
    );

    return newBooking;
  }

  // Actualiza una reserva
  async update(id, data) {
    const bookings = await this.getAll();

    const index = bookings.findIndex(
      booking => booking.id === Number(id)
    );

    if (index === -1) {
      return null;
    }

    const currentBooking = bookings[index];

    bookings[index] = {
      ...currentBooking,
      ...data,
      id: currentBooking.id
    };

    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2),
      'utf-8'
    );

    return bookings[index];
  }
}

export default BookingsDAO;