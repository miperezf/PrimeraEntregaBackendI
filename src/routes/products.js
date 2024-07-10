const express = require("express");
const router = express.Router();
const fs = require("fs");
const { products } = require("../data/products");

const productsDB = products;

// GET

router.get("/products", (req, res) => {
  res.json(products);
});

//GET BY ID

router.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((product) => product.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

// POST

router.post("/products", (req, res) => {
  const { nombre, id, precio, imagen, descripcion } = req.body;

  if (typeof id !== "number") {
    return res
      .status(400)
      .json({ message: "El campo 'id' debe ser un número" });
  }

  if (!nombre || !precio || !imagen || !descripcion) {
    res.status(400).json({ message: "Error faltan datos" });
  } else {
    res.json({ message: "Producto agregado exitosamente" });
  }

  const newProducts = {
    nombre,
    id: products.length + 1,
    precio,
    imagen,
    descripcion,
  };

  products.push(newProducts);
});

// PUT ==> Adecuar a los requisitos del producto

router.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((product) => product.id === productId);

  if (product) {
    const { nombre, id, precio, imagen, descripcion } = req.body;

    (product.nombre = nombre),
      (product.id = id),
      (product.precio = precio),
      (product.imagen = imagen),
      (product.descripcion = descripcion),
      res.json(product);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

// DELETE

router.delete("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  products = products.filter((product) => product.id !== productId);

  res.json({ message: "Producto eliminado correctamente" });
});

module.exports = router;
