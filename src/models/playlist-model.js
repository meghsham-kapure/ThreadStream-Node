import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const playlistSchema = new mongoose.Schema(
  {
    video: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video"
    }],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

  },
  {
    timestamps: true
  }
);

playlistSchema.plugin(mongooseAggregatePaginate);

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
