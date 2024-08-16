const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const http = require("http");
const socketIo = require("socket.io");

const connectToMongoDB = require("./database/connection");
const Product = require("./models/Product");

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP
const io = socketIo(server); // Configurar Socket.io con el servidor HTTP

const PORT = 8080;

// Conectar a MongoDB
connectToMongoDB();

// Configuración de Handlebars
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");

app.use("/products", productRoutes);
app.use("/carts", cartRoutes);

// Ruta principal
app.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("products", { title: "Productos", products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Ruta de productos en tiempo real
app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Ruta para mostrar todos los productos
app.get("/products", async (req, res) => {
  try {
    console.log("Ruta /products llamada");
    const products = await Product.find({});
    console.log("Productos encontrados:", products);
    res.render("products", { title: "Lista de Productos", products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Configurar Socket.io
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Maneja el evento "addProduct" recibido del cliente
  socket.on("addProduct", async (productData) => {
    try {
      // Agrega el producto a la base de datos
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

  // Maneja la desconexión del cliente
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
