import mongoose from 'mongoose';
import ServiceModel from './models/service.model.js';

class ServicesDAO {

  // Obtiene todos los servicios de MongoDB
  async getAll() {
    return await ServiceModel.find();
  }

  // Busca un servicio por su _id de MongoDB
  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await ServiceModel.findById(id);
  }

  // Crea un nuevo servicio
  async create(data) {
    return await ServiceModel.create(data);
  }

  // Actualiza un servicio existente
  async update(id, data) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await ServiceModel.findByIdAndUpdate(
      id,
      data,
      {
        returnDocument: 'after',
        runValidators: true
      }
    );
  }

  // Elimina un servicio
  async delete(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await ServiceModel.findByIdAndDelete(id);
  }
}

export default ServicesDAO;