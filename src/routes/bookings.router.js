import express from 'express';
import BookingManager from '../managers/BookingManager.js';
import ServiceManager from '../managers/ServiceManager.js';

const router = express.Router();

const bookingManager = new BookingManager('./src/data/bookings.json');
const serviceManager = new ServiceManager('./src/data/services.json');


// POST /api/bookings
// Crea una nueva reserva
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body ?? {};

    if (
      !bookingData.clientName ||
      !bookingData.clientEmail ||
      !bookingData.date ||
      !bookingData.time ||
      !bookingData.status
    ) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios'
      });
    }

    const newBooking =
      await bookingManager.createBooking(bookingData);

    res.status(201).json(newBooking);

  } catch (error) {
    res.status(500).json({
      error: 'Error al crear la reserva'
    });
  }
});


// GET /api/bookings/:bid
// Devuelve una reserva por ID
router.get('/:bid', async (req, res) => {
  try {
    const bid = Number(req.params.bid);

    const booking =
      await bookingManager.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        error: 'Reserva no encontrada'
      });
    }

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener la reserva'
    });
  }
});


// POST /api/bookings/:bid/services/:sid
// Agrega un servicio a una reserva existente
router.post('/:bid/services/:sid', async (req, res) => {
  try {
    const bid = Number(req.params.bid);
    const sid = Number(req.params.sid);

    // Comprobamos que exista la reserva
    const booking =
      await bookingManager.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        error: 'Reserva no encontrada'
      });
    }

    // Comprobamos que exista el servicio
    const service =
      await serviceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    const updatedBooking =
      await bookingManager.addServiceToBooking(
        bid,
        sid
      );

    res.status(200).json(updatedBooking);

  } catch (error) {
    res.status(500).json({
      error: 'Error al agregar el servicio a la reserva'
    });
  }
});

export default router;