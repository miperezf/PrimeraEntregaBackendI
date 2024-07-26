const express = require("express");
const { create } = require("express-handlebars");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const { initSocket } = require("./socket");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

const productsPath = path.join(__dirname, "data", "products.json");
const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

app.engine("handlebars", create().engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home", { products: productsData });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initSocket(server, productsData);
