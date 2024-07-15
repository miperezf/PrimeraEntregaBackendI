const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const cartsPath = path.join(__dirname, "..", "data", "carts.json");

function readCartData() {
  try {
    const cartsData = JSON.parse(fs.readFileSync(cartsPath, "utf-8"));
    if (!Array.isArray(cartsData)) {
      return [];
    }
    return cartsData;
  } catch (err) {
    console.error("Error al leer los datos del carrito:", err);
    return [];
  }
}

function saveCartData(cartData, callback) {
  const jsonData = JSON.stringify(cartData, null, 2);
  fs.writeFile(cartsPath, jsonData, (err) => {
    if (err) {
      console.error("Error al guardar los datos del carrito:", err);
      callback(err);
    } else {
      console.log("Datos del carrito guardados");
      callback(null);
    }
  });
}

router.post("/carts", (req, res) => {
  const newCartId = readCartData().length + 1;
  const newCart = {
    id: newCartId,
    products: [],
  };

  const cartsData = readCartData();
  cartsData.push(newCart);

  saveCartData(cartsData, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error al crear el carrito" });
    }
    res.json(newCart);
  });
});

router.get("/carts/:cid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const cartData = readCartData();
  const cart = cartData.find((cart) => cart.id === cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: "Carrito no encontrado" });
  }
});

router.post("/carts/:cid/product/:pid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const cartData = readCartData();
  const cart = cartData.find((cart) => cart.id === cid);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  let productExists = cart.products.find((product) => product.id === pid);

  if (productExists) {
    productExists.quantity++;
  } else {
    cart.products.push({
      id: pid,
      quantity: 1,
    });
  }

  saveCartData(cartData, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al agregar el producto al carrito" });
    }
    res.json({ message: "Producto agregado al carrito exitosamente" });
  });
});

module.exports = router;
