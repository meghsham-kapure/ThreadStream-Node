import mongoose from 'mongoose';

const subTodoSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

export const subTodos = mongoose.model('SubTodo', subTodoSchema);
