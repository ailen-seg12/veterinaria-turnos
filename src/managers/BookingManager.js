import fs from 'fs/promises';

class BookingManager {
  constructor(path) {
    this.path = path;
  }

  // Lee todas las reservas del archivo
  async readBookings() {
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

  // Guarda las reservas en el archivo
  async writeBookings(bookings) {
    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2),
      'utf-8'
    );
  }

  // Crea una nueva reserva
  async createBooking(bookingData) {
    const bookings = await this.readBookings();

    const newId =
      bookings.length === 0
        ? 1
        : Math.max(...bookings.map(booking => booking.id)) + 1;

    const newBooking = {
      id: newId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: []
    };

    bookings.push(newBooking);

    await this.writeBookings(bookings);

    return newBooking;
  }

  // Busca una reserva por ID
  async getBookingById(id) {
    const bookings = await this.readBookings();

    const booking = bookings.find(
      booking => booking.id === id
    );

    return booking || null;
  }

  // Agrega un servicio a una reserva
  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this.readBookings();

    const booking = bookings.find(
      booking => booking.id === bookingId
    );

    if (!booking) {
      return null;
    }

    const existingService = booking.services.find(
      item => item.service === serviceId
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: serviceId,
        quantity: 1
      });
    }

    await this.writeBookings(bookings);

    return booking;
  }
}

export default BookingManager;