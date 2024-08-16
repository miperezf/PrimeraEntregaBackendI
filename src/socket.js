// socket.js

const io = require("socket.io")(server); // Asegúrate de importar y pasar el servidor Express

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Maneja el evento "addProduct" recibido del cliente
  socket.on("addProduct", async (productData) => {
    try {
      // Aquí deberías agregar el producto a la base de datos
      const Product = require("./models/Product");
      const newProduct = new Product(productData);
      await newProduct.save();

      // Obtiene la lista actualizada de productos
      const products = await Product.find();

      // Emite el evento "updateProducts" con la lista de productos actualizada
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });
});
