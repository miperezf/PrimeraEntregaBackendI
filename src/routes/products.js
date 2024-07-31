const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "..", "data", "products.json");

const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

// GET

router.get("/products", (req, res) => {
  let limit = req.query.limit;
  let productsToSend = productsData;

  if (limit && !isNaN(limit)) {
    productsToSend = productsData.slice(0, parseInt(limit));
  }

  res.json(productsToSend);
});

// GET BY ID

router.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productsData.find((product) => product.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

// // POST

router.post("/products", (req, res) => {
  const { id, title, description, price, status, stock, category, thumbails } =
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
    imagen,
  };

  productsData.push(newProduct);

  const jsonData = JSON.stringify(productsData, null, 2);

  fs.writeFile("src/data/products.json", jsonData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al guardar el producto" });
    }
    console.log("Producto Agregado");

    res.json({ message: "Producto agregado exitosamente" });
  });
});

// // PUT ==> Adecuar a los requisitos del producto

router.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productsData.find((product) => product.id === productId);

  if (product) {
    const {
      id,
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbails,
    } = req.body;

    product.title = title;
    product.price = price;
    product.status = status;
    product.description = description;

    const jsonData = JSON.stringify(productsData, null, 2);

    fs.writeFile("src/data/products.json", jsonData, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error al guardar el producto" });
      }
      console.log("Producto modificado");

      res.json({ message: "Producto modificado exitosamente" });
    });
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

// // DELETE

router.delete("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);

  const updatedProducts = productsData.filter(
    (product) => product.id !== productId
  );

  if (updatedProducts.length < productsData.length) {
    const jsonData = JSON.stringify(updatedProducts, null, 2);
    fs.writeFile(productsPath, jsonData, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error al guardar los datos actualizados" });
      }
      console.log("Producto eliminado correctamente");

      res.json({ message: "Producto eliminado correctamente" });
    });
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

module.exports = router;
