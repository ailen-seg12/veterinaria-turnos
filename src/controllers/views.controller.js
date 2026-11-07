import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService();


// Vista con todos los servicios
export const renderServices = async (req, res) => {
  try {
    const services = await servicesService.getServices();

    const plainServices = services.map(service =>
      service.toObject()
    );

    return res.render('services', {
      services: plainServices
    });

  } catch (error) {
    return res.status(500).send(
      'Error al cargar los servicios'
    );
  }
};


// Vista con servicios disponibles
export const renderAvailability = async (req, res) => {
  try {
    const services = await servicesService.getServices({
      available: true
    });

    const plainServices = services.map(service =>
      service.toObject()
    );

    return res.render('availability', {
      services: plainServices
    });

  } catch (error) {
    return res.status(500).send(
      'Error al cargar la disponibilidad'
    );
  }
};