const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 0;
    let products = await Product.find({});

    if (limit > 0) {
      products = products.slice(0, limit);
    }

    // Renderiza la plantilla "products" y pasa los datos de productos
    res.render("products", { title: "Lista de Productos", products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Verificar si el ID es una cadena hexadecimal válida de 24 caracteres
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    const product = await Product.findById(productId);

    if (product) {
      // Renderiza una plantilla específica para mostrar el producto
      res.render("productDetail", { title: "Detalle del Producto", product });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort = "asc", query = "" } = req.query;
  const sortOrder = sort === "desc" ? -1 : 1;

  try {
    const filter = query ? { category: query } : {};
    const products = await Product.find(filter)
      .sort({ price: sortOrder })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage
        ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: nextPage
        ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener productos" });
  }
});

// POST new product
router.post("/", async (req, res) => {
  try {
    const { title, description, price, status, stock, category, thumbnails } =
      req.body;
    const newProduct = new Product({
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error al agregar el producto" });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (deletedProduct) {
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

module.exports = router;
