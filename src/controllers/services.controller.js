import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService();


// GET /api/services
export const getServices = async (req, res) => {
  try {
    const category = req.query.category;
    const available = req.query.available;

    const services = await servicesService.getServices({
      category,
      available
    });

    return res.status(200).json(services);

  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener los servicios'
    });
  }
};


// GET /api/services/:sid
export const getServiceById = async (req, res) => {
  try {
    const sid = Number(req.params.sid);

    const service = await servicesService.getServiceById(sid);

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
    const sid = Number(req.params.sid);

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
    const sid = Number(req.params.sid);

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