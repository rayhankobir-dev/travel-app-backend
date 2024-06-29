import { Server } from "socket.io";
import { Chat } from "../models/chat.model.js";
const userSockets = new Map();

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    socket.on("join", (user) => {
      if (user.role === "user") {
        socket.join("user-room");
        userSockets.set(user._id, socket.id);
        console.log(`${user.fullName} - joined user room`);
      } else if (user.role === "admin") {
        socket.join("admin-room");
        console.log(`${user.fullName} - joined admin room`);
      } else {
        socket.disconnect();
      }

      console.log(userSockets);
    });

    socket.on("send-to-admin", async (data) => {
      console.log({ data });
      const chatMessage = new Chat({
        sender: data.sender,
        message: data.message,
      });
      await chatMessage.save();

      await chatMessage.populate("sender reciever", "_id fullName email role");

      io.to(socket.id).emit("receive-message", {
        from: socket.id,
        chat: chatMessage,
      });
      io.to("admin-room").emit("receive-message", {
        from: socket.id,
        chat: chatMessage,
      });
    });

    socket.on("send-to-user", async (data) => {
      const chatMessage = new Chat({
        sender: data.sender,
        reciever: data.receiver,
        message: data.message,
        isAdmin: true,
      });
      await chatMessage.save();
      await chatMessage.populate("sender reciever", "_id fullName email role");

      io.to("admin-room").emit("receive-message", {
        from: "admin",
        chat: chatMessage,
      });

      io.to(userSockets.get(data.receiver)).emit("receive-message", {
        from: "admin",
        chat: chatMessage,
      });
    });
  });
}
