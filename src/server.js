const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const productManager = require("./managers/productManager");
const { initSocket } = require("./socket");

const app = express();

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configuración de express-handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Ruta para la vista de productos en tiempo real
app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realtimeproducts", { products });
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
});

app.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("products", { products });
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
});

// Iniciar el servidor y configurar Socket.io
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initSocket(server);
