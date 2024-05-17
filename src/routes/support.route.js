import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { roleSchem } from "../validation/index.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Message } from "../models/chat.model.js";
import { io } from "../app.js";

const chatRoute = new Router();

chatRoute.post(
  "/send-message",
  asyncHandler(async (req, res) => {
    const { receiverId, message } = req.body;
    try {
      const newMessage = new Message({
        senderId: req.user._id,
        receiverId,
        message,
      });

      await newMessage.save();

      req.io.emit("messageSent", newMessage);
      req.io.to(socket).emit("messageReceived", newMessage);

      res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send message" });
    }
  })
);

export default chatRoute;
