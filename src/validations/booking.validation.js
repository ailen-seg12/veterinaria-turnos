import { z } from 'zod';


// Validación para crear una reserva
export const createBookingSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, 'El nombre del cliente es obligatorio'),

  clientEmail: z
    .string()
    .trim()
    .email('El email no tiene un formato válido'),

  date: z
    .string()
    .trim()
    .min(1, 'La fecha es obligatoria'),

  time: z
    .string()
    .trim()
    .min(1, 'La hora es obligatoria'),

  status: z
    .string()
    .trim()
    .optional()
});


// Validación para los IDs usados al agregar
// un servicio a una reserva
export const addServiceToBookingSchema = z.object({
  bid: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'El ID de la reserva no es válido'
    ),

  sid: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'El ID del servicio no es válido'
    )
});