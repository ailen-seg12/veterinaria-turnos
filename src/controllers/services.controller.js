import ServiceManager from '../managers/ServiceManager.js';

const manager = new ServiceManager('./src/data/services.json');


// GET /api/services
export const getServices = async (req, res) => {
  try {
    const category = req.query.category;
    const available = req.query.available;

    const services = await manager.getServices({
      category,
      available
    });

    res.status(200).json(services);

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los servicios'
    });
  }
};


// GET /api/services/:sid
export const getServiceById = async (req, res) => {
  try {
    const sid = Number(req.params.sid);

    const service = await manager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    res.status(200).json(service);

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el servicio'
    });
  }
};


// POST /api/services
export const createService = async (req, res) => {
  try {
    const serviceData = req.body ?? {};

    if (
      !serviceData.name ||
      !serviceData.description ||
      !serviceData.duration ||
      !serviceData.price ||
      !serviceData.category ||
      serviceData.available === undefined
    ) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios'
      });
    }

    const newService = await manager.addService(serviceData);

    res.status(201).json(newService);

  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el servicio'
    });
  }
};


// PUT /api/services/:sid
export const updateService = async (req, res) => {
  try {
    const sid = Number(req.params.sid);

    // Evita que se pueda modificar el ID
    const { id, ...updateData } = req.body;

    const updatedService = await manager.updateService(
      sid,
      updateData
    );

    if (!updatedService) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    res.status(200).json(updatedService);

  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el servicio'
    });
  }
};


// DELETE /api/services/:sid
export const deleteService = async (req, res) => {
  try {
    const sid = Number(req.params.sid);

    // Primero comprobamos que exista
    const service = await manager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    // Si existe, lo eliminamos
    await manager.deleteService(sid);

    return res.status(200).json({
      message: 'Servicio eliminado correctamente',
      service
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error al eliminar el servicio'
    });
  }
};