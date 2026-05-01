import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },

    commentedOn: {
      type: String,
      required: true,
      enum: ['Video', 'Post']
    },

    commentedOnTarget: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'commentedOn'
    },
    
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment
