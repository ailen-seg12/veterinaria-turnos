import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true
    },
    clientEmail: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'pendiente'
    },
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'services',
          required: true
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const BookingModel = mongoose.model('bookings', bookingSchema);

export default BookingModel;