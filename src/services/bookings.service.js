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

  // Convierte una hora HH:mm a minutos.
  // Ejemplo: 17:30 -> 1050
  timeToMinutes(time) {
    const [hours, minutes] = time
      .split(':')
      .map(Number);

    return hours * 60 + minutes;
  }

  // Calcula cuánto dura una reserva
  // sumando la duración de todos sus servicios.
  calculateBookingDuration(services = []) {
    return services.reduce((total, item) => {
      const service = item.service;

      if (!service || !service.duration) {
        return total;
      }

      const quantity = item.quantity || 1;

      return total + service.duration * quantity;
    }, 0);
  }

  // Comprueba si dos rangos horarios se superponen.
  schedulesOverlap(
    startA,
    endA,
    startB,
    endB
  ) {
    return startA < endB && endA > startB;
  }

  // Verifica si el horario de una reserva
  // choca con otra reserva del mismo día.
  async validateSchedule(
    booking,
    candidateServices
  ) {
    const duration =
      this.calculateBookingDuration(
        candidateServices
      );

    // Si todavía no tiene servicios,
    // todavía no ocupa tiempo.
    if (duration <= 0) {
      return;
    }

    const newStart =
      this.timeToMinutes(booking.time);

    const newEnd =
      newStart + duration;

    const bookingsSameDate =
      await this.bookingsRepository.getByDate(
        booking.date
      );

    for (const otherBooking of bookingsSameDate) {

      // No comparar la reserva consigo misma.
      if (
        otherBooking._id.toString() ===
        booking._id.toString()
      ) {
        continue;
      }

      const otherDuration =
        this.calculateBookingDuration(
          otherBooking.services
        );

      // Una reserva sin servicios todavía
      // no ocupa horario.
      if (otherDuration <= 0) {
        continue;
      }

      const otherStart =
        this.timeToMinutes(
          otherBooking.time
        );

      const otherEnd =
        otherStart + otherDuration;

      const overlaps =
        this.schedulesOverlap(
          newStart,
          newEnd,
          otherStart,
          otherEnd
        );

      if (overlaps) {
        throw new Error(
          'El horario seleccionado se superpone con otra reserva'
        );
      }
    }
  }

  // Crea una nueva reserva
  async createBooking(data) {
    const {
      clientName,
      clientEmail,
      date,
      time
    } = data;

    if (
      !clientName ||
      !clientEmail ||
      !date ||
      !time
    ) {
      throw new Error(
        'Faltan campos obligatorios'
      );
    }

    return this.bookingsRepository.create({
      clientName,
      clientEmail,
      date,
      time,

      // Una reserva nueva siempre comienza pendiente.
      status: 'pendiente',

      services: []
    });
  }

  // Busca una reserva por ID
  async getBookingById(id) {
    const booking =
      await this.bookingsRepository.getById(id);

    if (!booking) {
      throw new Error(
        'Reserva no encontrada'
      );
    }

    return booking;
  }

  // Agrega un servicio a una reserva
  async addServiceToBooking(
    bookingId,
    serviceId
  ) {

    // 1. La reserva debe existir.
    const booking =
      await this.bookingsRepository.getById(
        bookingId
      );

    if (!booking) {
      throw new Error(
        'Reserva no encontrada'
      );
    }

    // 2. El servicio debe existir.
    const service =
      await this.servicesRepository.getById(
        serviceId
      );

    if (!service) {
      throw new Error(
        'Servicio no encontrado'
      );
    }

    // 3. El servicio debe estar disponible.
    if (!service.available) {
      throw new Error(
        'Servicio no disponible'
      );
    }

    // Copiamos los servicios actuales.
    const candidateServices =
      booking.services.map(item => ({
        service: item.service,
        quantity: item.quantity
      }));

    // 4. Comprobamos si ya tenía
    // ese mismo servicio.
    const existingService =
      candidateServices.find(
        item =>
          item.service._id.toString() ===
          service._id.toString()
      );

    if (existingService) {

      // Si ya estaba, aumentamos quantity.
      existingService.quantity += 1;

    } else {

      // Si no estaba, lo agregamos.
      candidateServices.push({
        service,
        quantity: 1
      });
    }

    // 5. Antes de guardar comprobamos
    // que la nueva duración no genere
    // una superposición.
    await this.validateSchedule(
      booking,
      candidateServices
    );

    // Para MongoDB guardamos nuevamente
    // solamente las referencias ObjectId.
    const servicesToSave =
      candidateServices.map(item => ({
        service:
          item.service._id ??
          item.service,

        quantity: item.quantity
      }));

    return this.bookingsRepository.update(
      bookingId,
      {
        services: servicesToSave
      }
    );
  }
}

export default BookingsService;