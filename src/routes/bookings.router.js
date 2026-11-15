import express from 'express';

import {
  createBooking,
  getBookingById,
  addServiceToBooking
} from '../controllers/bookings.controller.js';

import {
  createBookingSchema,
  addServiceToBookingSchema
} from '../validations/booking.validation.js';

import {
  validateBody,
  validateParams
} from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post(
  '/',
  validateBody(createBookingSchema),
  createBooking
);

router.get('/:bid', getBookingById);

router.post(
  '/:bid/services/:sid',
  validateParams(addServiceToBookingSchema),
  addServiceToBooking
);

export default router;