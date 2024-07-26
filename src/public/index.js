// src/public/index.js
const socket = io();

socket.on("products", (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Limpia la lista actual

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `ID: ${product.id} - ${product.title} - Precio: ${product.price}`;
    productList.appendChild(li);
  });
});
