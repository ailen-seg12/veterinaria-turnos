import BookingsService from '../services/bookings.service.js';

const bookingsService = new BookingsService();


// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body ?? {};

    const newBooking =
      await bookingsService.createBooking(bookingData);

    return res.status(201).json(newBooking);

  } catch (error) {
    if (error.message === 'Faltan campos obligatorios') {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Error al crear la reserva'
    });
  }
};


// GET /api/bookings/:bid
export const getBookingById = async (req, res) => {
  try {
    const bid = Number(req.params.bid);

    const booking =
      await bookingsService.getBookingById(bid);

    return res.status(200).json(booking);

  } catch (error) {
    if (error.message === 'Reserva no encontrada') {
      return res.status(404).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Error al obtener la reserva'
    });
  }
};


// POST /api/bookings/:bid/services/:sid
export const addServiceToBooking = async (req, res) => {
  try {
    const bid = Number(req.params.bid);
    const sid = Number(req.params.sid);

    const updatedBooking =
      await bookingsService.addServiceToBooking(
        bid,
        sid
      );

    return res.status(200).json(updatedBooking);

  } catch (error) {
    if (
      error.message === 'Reserva no encontrada' ||
      error.message === 'Servicio no encontrado'
    ) {
      return res.status(404).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Error al agregar el servicio a la reserva'
    });
  }
};