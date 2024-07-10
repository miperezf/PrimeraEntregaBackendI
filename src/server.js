const express = require("express");
const productsRouter = require("./routes/products.js");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", productsRouter);

app.listen(3000, () => {
  console.log(`Server runing on port ${PORT}`);
});
