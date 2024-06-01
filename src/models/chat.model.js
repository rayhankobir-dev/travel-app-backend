import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    reciever: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    message: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
