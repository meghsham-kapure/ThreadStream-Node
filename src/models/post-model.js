import mongoose from 'mongoose';

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

const Post = mongoose.model("Post", postSchema);

export default Post;
