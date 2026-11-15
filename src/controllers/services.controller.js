import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService();


// GET /api/services
export const getServices = async (req, res) => {
  try {
    const result =
      await servicesService.getPaginatedServices(
        req.query
      );

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener los servicios'
    });
  }
};


// GET /api/services/:sid
export const getServiceById = async (req, res) => {
  try {
    const sid = req.params.sid;

    const service =
      await servicesService.getServiceById(sid);

    return res.status(200).json(service);

  } catch (error) {
    if (error.message === 'Servicio no encontrado') {
      return res.status(404).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Error al obtener el servicio'
    });
  }
};


// POST /api/services
export const createService = async (req, res) => {
  try {
    const serviceData = req.body ?? {};

    const newService =
      await servicesService.createService(serviceData);

    // Obtenemos Socket.IO desde Express
    const io = req.app.get('io');

    // Obtenemos la lista actualizada de servicios
    const services =
      await servicesService.getServices();

    // Convertimos documentos Mongoose a objetos simples
    const plainServices = services.map(service =>
      service.toObject()
    );

    // Avisamos a todos los clientes conectados
    io.emit('servicesUpdated', plainServices);

    return res.status(201).json(newService);

  } catch (error) {
    if (
      error.message === 'Faltan campos obligatorios' ||
      error.message === 'El precio no puede ser negativo'
    ) {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Error al crear el servicio'
    });
  }
};


// PUT /api/services/:sid
export const updateService = async (req, res) => {
  try {
    const sid = req.params.sid;

    const updatedService =
      await servicesService.updateService(
        sid,
        req.body ?? {}
      );

    return res.status(200).json(updatedService);

  } catch (error) {
    if (error.message === 'Servicio no encontrado') {
      return res.status(404).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Error al actualizar el servicio'
    });
  }
};


// DELETE /api/services/:sid
export const deleteService = async (req, res) => {
  try {
    const sid = req.params.sid;

    const deletedService =
      await servicesService.deleteService(sid);

    return res.status(200).json({
      message: 'Servicio eliminado correctamente',
      service: deletedService
    });

  } catch (error) {
    if (error.message === 'Servicio no encontrado') {
      return res.status(404).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Error al eliminar el servicio'
    });
  }
};