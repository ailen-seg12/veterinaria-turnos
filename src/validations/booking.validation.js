import { z } from 'zod';


// Verifica que una fecha exista realmente.
// Ejemplo: 2027-02-31 no existe.
const isValidDate = (value) => {
  const [year, month, day] =
    value.split('-').map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};


// Obtiene la fecha actual en formato YYYY-MM-DD
const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    today.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


// Comprueba si fecha + hora ya pasaron
const isPastDateTime = (date, time) => {
  const [year, month, day] =
    date.split('-').map(Number);

  const [hours, minutes] =
    time.split(':').map(Number);

  const bookingDateTime = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes
  );

  return bookingDateTime <= new Date();
};


export const createBookingSchema = z
  .object({

    clientName: z
      .string()
      .trim()
      .min(
        1,
        'El nombre del cliente es obligatorio'
      ),

    clientEmail: z
      .string()
      .trim()
      .email(
        'El email no tiene un formato válido'
      ),

    date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'La fecha debe tener formato YYYY-MM-DD'
      )
      .refine(
        isValidDate,
        'La fecha ingresada no es válida'
      )
      .refine(
        date => date >= getToday(),
        'No se puede reservar en una fecha pasada'
      ),

    time: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        'La hora debe tener formato HH:mm'
      )
  })

  // Validación conjunta de fecha + hora
  .superRefine((data, ctx) => {

    const validDateFormat =
      /^\d{4}-\d{2}-\d{2}$/.test(data.date);

    const validTimeFormat =
      /^([01]\d|2[0-3]):[0-5]\d$/.test(data.time);

    if (
      validDateFormat &&
      validTimeFormat &&
      isValidDate(data.date) &&
      isPastDateTime(data.date, data.time)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['time'],
        message:
          'No se puede reservar en un horario que ya pasó'
      });
    }
  });


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