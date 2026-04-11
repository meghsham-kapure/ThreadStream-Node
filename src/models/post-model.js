import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Max 5 images are allowed",
      },
    },

    mentions: {
      type: String,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
