'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},


bootstrap({ strapi }) {
  const { Server } = require("socket.io");

  const io = new Server(strapi.server.httpServer, {
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A new client connected:", socket.id);

    socket.on("sendMsg", (msgData) => {
      console.log("Received message from client:", msgData);

      const serverMessage = {
        ...msgData,
        username: 'server',
      };

      socket.emit("recvMsg", serverMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  strapi.io = io;
},
}
