import ServicesRepository from '../repositories/services.repository.js';
import BookingsRepository from '../repositories/bookings.repository.js';

class ServicesService {
  constructor(
    repository = new ServicesRepository(),
    bookingsRepository = new BookingsRepository()
  ) {
    this.repository = repository;
    this.bookingsRepository = bookingsRepository;
  }


  // Se sigue usando para vistas y Socket.IO
  async getServices(filters = {}) {
    const filter = {};

    if (filters.category) {
      filter.category = filters.category;
    }

    if (filters.available !== undefined) {
      filter.available =
        filters.available === true ||
        filters.available === 'true';
    }

    return this.repository.getAll(filter);
  }


  // GET /api/services con consultas avanzadas
  async getPaginatedServices(query = {}) {
    const {
      category,
      available,
      page = 1,
      limit = 10,
      sortBy = 'price',
      order = 'asc'
    } = query;


    // -------------------------
    // FILTROS
    // -------------------------
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (available !== undefined) {
      filter.available =
        available === true ||
        available === 'true';
    }


    // -------------------------
    // PAGINACIÓN
    // -------------------------
    const currentPage =
      Number(page) > 0 ? Number(page) : 1;

    const currentLimit =
      Number(limit) > 0 ? Number(limit) : 10;

    const skip =
      (currentPage - 1) * currentLimit;


    // -------------------------
    // ORDENAMIENTO
    // -------------------------
    const allowedSortFields = [
      'name',
      'price',
      'duration',
      'category'
    ];

    const selectedSortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : 'price';

    const sortOrder =
      order === 'desc' ? -1 : 1;

    const sort = {
      [selectedSortField]: sortOrder
    };


    // -------------------------
    // CONSULTA A MONGODB
    // -------------------------
    const {
      services,
      total
    } = await this.repository.getPaginated({
      filter,
      skip,
      limit: currentLimit,
      sort
    });


    // -------------------------
    // METADATA
    // -------------------------
    const totalPages =
      Math.ceil(total / currentLimit);

    const hasPrevPage =
      currentPage > 1;

    const hasNextPage =
      currentPage < totalPages;


    return {
      services,
      pagination: {
        totalResults: total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasPrevPage,
        hasNextPage
      }
    };
  }


  async getServiceById(id) {
    const service =
      await this.repository.getById(id);

    if (!service) {
      throw new Error(
        'Servicio no encontrado'
      );
    }

    return service;
  }


  async createService(data) {
    const {
      name,
      description,
      duration,
      price,
      category,
      available
    } = data;

    if (
      !name ||
      !description ||
      !duration ||
      price === undefined ||
      !category ||
      available === undefined
    ) {
      throw new Error(
        'Faltan campos obligatorios'
      );
    }

    if (Number(price) < 0) {
      throw new Error(
        'El precio no puede ser negativo'
      );
    }

    const parsedAvailable =
      available === true ||
      available === 'true';

    return this.repository.create({
      name,
      description,
      duration: Number(duration),
      price: Number(price),
      category,
      available: parsedAvailable
    });
  }


  async updateService(id, data) {
    const {
      id: ignoredId,
      _id: ignoredMongoId,
      ...updateData
    } = data;

    const updatedService =
      await this.repository.update(
        id,
        updateData
      );

    if (!updatedService) {
      throw new Error(
        'Servicio no encontrado'
      );
    }

    return updatedService;
  }


  async deleteService(id) {
    // Primero verificamos que exista
    const service =
      await this.repository.getById(id);

    if (!service) {
      throw new Error(
        'Servicio no encontrado'
      );
    }

    // Consultamos si el servicio
    // está asociado a alguna reserva
    const bookingsUsingService =
      await this.bookingsRepository
        .countByServiceId(id);

    // Si ya fue usado, no se elimina
    // para no romper el historial
    if (bookingsUsingService > 0) {
      throw new Error(
        'No se puede eliminar un servicio asociado a reservas'
      );
    }

    return this.repository.delete(id);
  }
}

export default ServicesService;