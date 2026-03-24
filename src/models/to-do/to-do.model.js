import mongoose from 'mongoose';

const todoSchema = new mongoose.schema(
  {
    title: {
      type: String,
      required: [true, 'title is mandatory'],
    },

    complete: {
      type: Boolean,
      default: false,
    },

    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    subTodo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTodo' }],
  },
  { timestamps: true }
);

export const todo = mongoose.model('Todo', todoSchema);
