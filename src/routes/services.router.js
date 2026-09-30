import express from 'express';
import ServiceManager from '../managers/ServiceManager.js';

const router = express.Router();

const manager = new ServiceManager('./src/data/services.json');

// GET /api/services
// Devuelve todos los servicios.
// Permite filtrar por category y available.
router.get('/', async (req, res) => {
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
});


// GET /api/services/:sid
// Devuelve un servicio específico por ID.
router.get('/:sid', async (req, res) => {
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
});


// POST /api/services
// Crea un nuevo servicio.
router.post('/', async (req, res) => {
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
});


// PUT /api/services/:sid
// Actualiza un servicio existente.
// No permite modificar el ID.
router.put('/:sid', async (req, res) => {
  try {
    const sid = Number(req.params.sid);

    const { id, ...updateData } = req.body ?? {};

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
});


// DELETE /api/services/:sid
// Elimina un servicio existente.
router.delete('/:sid', async (req, res) => {
  try {
    const sid = Number(req.params.sid);

    const deletedService = await manager.deleteService(sid);

    if (!deletedService) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    res.status(200).json({
      message: 'Servicio eliminado correctamente',
      service: deletedService
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el servicio'
    });
  }
});

export default router;