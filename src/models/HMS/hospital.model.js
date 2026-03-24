import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  line1: {
    type: String,
    required: true,
  },
  line2: { type: String },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: 'India',
  },
});

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: addressSchema,

    specializedIn: [{ type: String }],
  },
  { timestamps: true }
);

export const Hospital = mongoose.model('Hospital', hospitalSchema);
