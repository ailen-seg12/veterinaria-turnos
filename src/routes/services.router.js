import express from 'express';

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';

import {
  createServiceSchema,
  updateServiceSchema
} from '../validations/service.validation.js';

import {
  validateBody
} from '../middlewares/validation.middleware.js';

const router = express.Router();

router.get('/', getServices);

router.get('/:sid', getServiceById);

router.post(
  '/',
  validateBody(createServiceSchema),
  createService
);

router.put(
  '/:sid',
  validateBody(updateServiceSchema),
  updateService
);

router.delete('/:sid', deleteService);

export default router;