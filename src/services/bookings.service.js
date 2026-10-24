import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesRepository from '../repositories/services.repository.js';

class BookingsService {
  constructor(
    bookingsRepository = new BookingsRepository(),
    servicesRepository = new ServicesRepository()
  ) {
    this.bookingsRepository = bookingsRepository;
    this.servicesRepository = servicesRepository;
  }

  // Crea una nueva reserva
  async createBooking(data) {
    const {
      clientName,
      clientEmail,
      date,
      time,
      status
    } = data;

    if (
      !clientName ||
      !clientEmail ||
      !date ||
      !time ||
      !status
    ) {
      throw new Error('Faltan campos obligatorios');
    }

    return this.bookingsRepository.create({
      clientName,
      clientEmail,
      date,
      time,
      status,
      services: []
    });
  }

  // Busca una reserva por ID
  async getBookingById(id) {
    const booking =
      await this.bookingsRepository.getById(id);

    if (!booking) {
      throw new Error('Reserva no encontrada');
    }

    return booking;
  }

  // Agrega un servicio a una reserva
  async addServiceToBooking(bookingId, serviceId) {
    // Validamos que exista la reserva
    const booking =
      await this.bookingsRepository.getById(bookingId);

    if (!booking) {
      throw new Error('Reserva no encontrada');
    }

    // Validamos que exista el servicio
    const service =
      await this.servicesRepository.getById(serviceId);

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    // Buscamos si ese servicio ya estaba agregado
    const existingService = booking.services.find(
      item => item.service === Number(serviceId)
    );

    if (existingService) {
      // Si ya existe, incrementamos quantity
      existingService.quantity += 1;
    } else {
      // Si no existe, lo agregamos por primera vez
      booking.services.push({
        service: Number(serviceId),
        quantity: 1
      });
    }

    return this.bookingsRepository.update(
      bookingId,
      {
        services: booking.services
      }
    );
  }
}

export default BookingsService;