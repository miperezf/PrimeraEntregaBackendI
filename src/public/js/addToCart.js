document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      fetch(`/api/carts/addProduct/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Producto agregado al carrito");
          } else {
            alert("Error al agregar el producto");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  });
});
