const socket = io();

document
  .getElementById("addProductForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const newProduct = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: parseFloat(document.getElementById("price").value),
      status: document.getElementById("status").value,
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
      thumbails: document.getElementById("thumbails").value,
    };
    socket.emit("addProduct", newProduct);
  });

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    const productId = parseInt(event.target.getAttribute("data-id"));
    socket.emit("deleteProduct", productId);
  }
});

socket.on("products", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.title} - $${product.price}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete-button");
    deleteButton.setAttribute("data-id", product.id);
    listItem.appendChild(deleteButton);
    productList.appendChild(listItem);
  });
});
