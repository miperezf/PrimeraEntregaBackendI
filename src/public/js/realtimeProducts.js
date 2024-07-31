document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Manejar la recepción de productos
  socket.on("products", (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpiar la lista actual

    products.forEach((product) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${product.title} - $${product.price}`;

      // Mostrar la categoría y el stock si están disponibles
      if (product.category) {
        listItem.textContent += ` - Categoria: ${product.category}`;
      }
      if (product.stock) {
        listItem.textContent += ` - Stock: ${product.stock}`;
      }

      // Crear el botón de eliminar
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.onclick = () => {
        socket.emit("deleteProduct", product.id);
      };
      listItem.appendChild(deleteButton);
      productList.appendChild(listItem);
    });
  });

  // Manejar el formulario de agregar producto
  function addProduct() {
    const title = document.getElementById("product-title").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const category = document.getElementById("product-category").value;
    const stock = parseInt(document.getElementById("product-stock").value, 10);

    if (title && !isNaN(price)) {
      socket.emit("addProduct", { title, price, category, stock });
      document.getElementById("product-title").value = "";
      document.getElementById("product-price").value = "";
      document.getElementById("product-category").value = "";
      document.getElementById("product-stock").value = "";
    } else {
      alert("Por favor, completa todos los campos correctamente.");
    }
  }

  document.getElementById("add-product-form").onsubmit = (event) => {
    event.preventDefault();
    addProduct();
  };
});
