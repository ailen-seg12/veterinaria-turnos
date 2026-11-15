import mongoose from 'mongoose';
import BookingModel from './models/booking.model.js';

class BookingsDAO {

  // Obtiene todas las reservas desde MongoDB
  async getAll() {
    return await BookingModel.find();
  }

  // Busca una reserva por su _id y trae
  // los datos completos de los servicios asociados
  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await BookingModel
      .findById(id)
      .populate('services.service');
  }

  // Crea una nueva reserva
  async create(data) {
    return await BookingModel.create(data);
  }

  // Actualiza una reserva existente
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