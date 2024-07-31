const ProductManager = require("./managers/productManager");

let io;

function initSocket(server) {
  const socketIo = require("socket.io");
  io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Emitir los productos al nuevo cliente
    ProductManager.getProducts().then((products) => {
      socket.emit("products", products);
    });

    // Manejar la adición de un nuevo producto
    socket.on("addProduct", async (newProduct) => {
      await ProductManager.addProduct(newProduct);
      const products = await ProductManager.getProducts();
      io.emit("products", products); // Emitir productos a todos los clientes
    });

    // Manejar la eliminación de un producto
    socket.on("deleteProduct", async (productId) => {
      await ProductManager.deleteProduct(productId);
      const products = await ProductManager.getProducts();
      io.emit("products", products); // Emitir productos a todos los clientes
    });

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
