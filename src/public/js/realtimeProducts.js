document.addEventListener("DOMContentLoaded", () => {
  const socket = io(); // Conectar con el servidor WebSocket

  const form = document.getElementById("add-product-form");
  const productsList = document.getElementById("products-list");

  // Maneja el envío del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Obtiene los datos del formulario
    const title = document.getElementById("product-title").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const description = document.getElementById("product-description").value;
    const category = document.getElementById("product-category").value;
    const stock = parseInt(document.getElementById("product-stock").value);
    const status = document.getElementById("product-status").value; // Añadido

    // Envía los datos al servidor a través de WebSocket
    socket.emit("addProduct", {
      title,
      price,
      description,
      category,
      stock,
      status,
    });

    // Limpia el formulario
    form.reset();
  });

  // Maneja la actualización de la lista de productos en tiempo real
  socket.on("productAdded", (product) => {
    const li = document.createElement("li");
    li.innerHTML = `
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
          <p>Category: ${product.category}</p>
          <p>Stock: ${product.stock}</p>
      `;
    productsList.appendChild(li);
  });
});
