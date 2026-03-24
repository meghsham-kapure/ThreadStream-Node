import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: [String, 'userName should be string'],
      unique: [true, 'username must be unique'],
      required: [true, 'username is required'],
      lowercase: true,
    },
    email: {
      type: [String, 'email should be string'],
      unique: [true, 'email must be unique'],
      required: [true, 'email is required'],
      lowercase: true,
    },
    password: {
      type: [String, 'password should be string'],
      required: [true, 'password is required'],
    },
    isActive: { type: Boolean },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
