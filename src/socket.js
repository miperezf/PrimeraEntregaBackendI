let io;

function initSocket(server, productsData) {
  const socketIo = require("socket.io");
  io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Emitir productos cuando un cliente se conecta
    socket.emit("products", productsData);

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io no está inicializado");
  }
  return io;
}

module.exports = { initSocket, getIo };
