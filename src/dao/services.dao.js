import mongoose from 'mongoose';
import ServiceModel from './models/service.model.js';

class ServicesDAO {

  // Obtiene todos los servicios.
  // Lo seguimos usando para vistas y Socket.IO.
  async getAll(filter = {}) {
    return await ServiceModel.find(filter);
  }


  // Consulta avanzada con filtros, paginación y ordenamiento.
  async getPaginated({
    filter = {},
    skip = 0,
    limit = 10,
    sort = {}
  } = {}) {

    const [services, total] = await Promise.all([
      ServiceModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      ServiceModel.countDocuments(filter)
    ]);

    return {
      services,
      total
    };
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