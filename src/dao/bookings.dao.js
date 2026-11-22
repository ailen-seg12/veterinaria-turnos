import mongoose from 'mongoose';
import BookingModel from './models/booking.model.js';

class BookingsDAO {

  // Obtiene todas las reservas
  async getAll() {
    return await BookingModel
      .find()
      .populate('services.service');
  }

  // Obtiene las reservas de una fecha.
  // Las canceladas no ocupan horario.
  async getByDate(date) {
    return await BookingModel
      .find({
        date,
        status: { $ne: 'cancelado' }
      })
      .populate('services.service');
  }

  // Busca una reserva por ID
  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await BookingModel
      .findById(id)
      .populate('services.service');
  }

  // Cuenta cuántas reservas utilizan un servicio
  async countByServiceId(serviceId) {
    if (!mongoose.isValidObjectId(serviceId)) {
      return 0;
    }

    return await BookingModel.countDocuments({
      'services.service': serviceId
    });
  }

  // Crea una reserva
  async create(data) {
    return await BookingModel.create(data);
  }

  // Actualiza una reserva
  async update(id, data) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await BookingModel.findByIdAndUpdate(
      id,
      data,
      {
        returnDocument: 'after',
        runValidators: true
      }
    );
  }
}

export default BookingsDAO;