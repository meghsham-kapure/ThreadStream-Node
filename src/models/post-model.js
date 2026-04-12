import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new mongoose.Schema(
  {

    content: {
      type: String,
      required: true,
    },

    imageAttached: {
      type: String,
      trim: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

  },

  { timestamps: true }

);

postSchema.plugin(mongooseAggregatePaginate);

const Post = mongoose.model("Post", postSchema);

export default Post;
