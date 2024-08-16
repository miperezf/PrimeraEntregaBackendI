const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");

// GET all carts
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.productId");
    res.render("carts", { title: "Lista de Carritos", carts });
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).json({ message: "Error al obtener los carritos" });
  }
});

// POST create new cart
router.post("/", async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ message: "Error al crear el carrito" });
  }
});

// GET cart by ID
router.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;

    // Verifica si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido" });
    }

    const cart = await Cart.findById(cartId).populate("products.productId");

    if (cart) {
      res.render("cartDetail", { title: "Detalle del Carrito", cart });
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
});

// Ruta para agregar un producto al carrito
router.post("/addProduct/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Falta el ID del producto" });
    }

    let cart = await Cart.findById(cartId);
    if (!cart) {
      // Si no existe el carrito, créalo
      cart = new Cart({ _id: cartId, products: [] });
    }

    // Verifica si el producto ya está en el carrito y actualiza o agrega según sea necesario
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (productIndex >= 0) {
      // Si el producto ya existe, incrementa la cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si el producto no existe, agrégalo con cantidad 1
      cart.products.push({ productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Endpoint para eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products.pull({ productId: pid });
    await cart.save();
    res.json({ status: "success", message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto del carrito",
    });
  }
});

// Endpoint para actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products = products;
    await cart.save();
    res.json({ status: "success", message: "Carrito actualizado" });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar carrito" });
  }
});

// Endpoint para actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const product = cart.products.find((p) => p.productId.toString() === pid);
    if (product) {
      product.quantity = quantity;
      await cart.save();
      res.json({ status: "success", message: "Cantidad actualizada" });
    } else {
      res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }
  } catch (error) {
    console.error("Error al actualizar cantidad de producto:", error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar cantidad de producto",
    });
  }
});

// Endpoint para eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();
    res.json({
      status: "success",
      message: "Todos los productos eliminados del carrito",
    });
  } catch (error) {
    console.error("Error al eliminar productos del carrito:", error);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar productos del carrito",
    });
  }
});

// Endpoint para crear un carrito vacío
router.post("/create", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ cartId: newCart._id });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
