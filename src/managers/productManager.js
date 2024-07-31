const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "../data/products.json");

class ProductManager {
  static async getProducts() {
    try {
      const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
      return productsData;
    } catch (error) {
      console.error("Error retrieving products from manager:", error);
      throw error; // Re-lanzar el error para que lo capture el controlador
    }
  }

  static async addProduct(product) {
    try {
      const products = await this.getProducts();
      product.id = products.length + 1; // Asigna un ID basado en el tamaño del array
      products.push(product);
      await fs.promises.writeFile(
        productsPath,
        JSON.stringify(products, null, 2)
      );
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      let products = await this.getProducts();
      products = products.filter((p) => p.id !== productId);
      await fs.promises.writeFile(
        productsPath,
        JSON.stringify(products, null, 2)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
