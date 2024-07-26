const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "..", "data", "products.json");
let productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

// GET
router.get("/", (req, res) => {
  let limit = req.query.limit;
  let productsToSend = productsData;

  if (limit && !isNaN(limit)) {
    productsToSend = productsData.slice(0, parseInt(limit));
  }

  res.json(productsToSend);
});

// GET BY ID
router.get("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productsData.find((product) => product.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

// POST
router.post("/", (req, res) => {
  const { title, description, price, status, stock, category, thumbails } =
    req.body;

  if (!title || !price || !status || !description) {
    return res.status(400).json({ message: "Error, faltan datos" });
  }

  const newProduct = {
    id: productsData.length + 1,
    title,
    description,
    price,
    status,
    stock,
    category,
    thumbails,
  };

  productsData.push(newProduct);

  const jsonData = JSON.stringify(productsData, null, 2);
  fs.writeFile(productsPath, jsonData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al guardar el producto" });
    }
    console.log("Producto agregado");

    // Emitir evento de nuevo producto
    const { getIo } = require("../socket");
    const io = getIo();
    io.emit("products", productsData);

    res.json({ message: "Producto agregado exitosamente" });
  });
});

// PUT
router.put("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productsData.find((product) => product.id === productId);

  if (product) {
    const { title, description, price, status, stock, category, thumbails } =
      req.body;

    product.title = title;
    product.description = description;
    product.price = price;
    product.status = status;
    product.stock = stock;
    product.category = category;
    product.thumbails = thumbails;

    const jsonData = JSON.stringify(productsData, null, 2);
    fs.writeFile(productsPath, jsonData, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error al guardar el producto" });
      }
      console.log("Producto modificado");

      // Emitir evento de producto modificado
      const { getIo } = require("../socket");
      const io = getIo();
      io.emit("products", productsData);

      res.json({ message: "Producto modificado exitosamente" });
    });
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

// DELETE
router.delete("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProducts = productsData.filter(
    (product) => product.id !== productId
  );

  if (updatedProducts.length < productsData.length) {
    productsData = updatedProducts;
    const jsonData = JSON.stringify(productsData, null, 2);
    fs.writeFile(productsPath, jsonData, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error al guardar los datos actualizados" });
      }
      console.log("Producto eliminado correctamente");

      // Emitir evento de producto eliminado
      const { getIo } = require("../socket");
      const io = getIo();
      io.emit("products", productsData);

      res.json({ message: "Producto eliminado correctamente" });
    });
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

module.exports = router;
