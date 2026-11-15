import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio'),

  description: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria'),

  duration: z
    .number({
      message: 'La duración debe ser numérica'
    })
    .positive('La duración debe ser mayor a 0'),

  price: z
    .number({
      message: 'El precio debe ser numérico'
    })
    .nonnegative('El precio no puede ser negativo'),

  category: z
    .string()
    .trim()
    .min(1, 'La categoría es obligatoria'),

  available: z.boolean({
    message: 'La disponibilidad debe ser booleana'
  })
});

export const updateServiceSchema =
  createServiceSchema.partial();