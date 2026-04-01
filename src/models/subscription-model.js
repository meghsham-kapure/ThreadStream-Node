import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    // for the one who is subscribing the channel
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // for the one who got subscribed by the subscriber
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
