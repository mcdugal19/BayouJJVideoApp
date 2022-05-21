const express = require("express");
const productsRouter = express.Router();
const { Products } = require("../db");
const { adminRequired } = require("./utils");

// Route that sends back product information from every product.
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await Products.getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// Admin only route that will add a new product to the database. Sends back success message / product info.
productsRouter.post("/", adminRequired, async (req, res, next) => {
  const { productObj } = req.body;
  const { name, variation, game, image, description, price, inventory } =
    productObj;
  if (!name || !price || !inventory) {
    next({
      name: "RequiredFields",
      message:
        "Products must at least have a name, price, and inventory amount.",
    });
  } else {
    try {
      const product = await Products.createProduct({
        name,
        variation,
        game,
        image,
        description,
        price,
        inventory,
      });

      res.send({ message: "Successfully added product!", product });
    } catch (error) {
      next(error);
    }
  }
});

// Admin only route to update a specific product's information.
productsRouter.patch("/:productId", adminRequired, async (req, res, next) => {
  const { productId } = req.params;
  const { name, variation, game, image, description, price, inventory } =
    req.body;

  // build update object
  const updateObj = { id: productId };
  updateObj.name = name;
  updateObj.variation = variation;
  updateObj.game = game;
  updateObj.image = image;
  updateObj.description = description;
  updateObj.price = price;
  updateObj.inventory = inventory;

  try {
    const product = await Products.updateProduct(updateObj);

    res.send({ message: "Successfully updated product!", product });
  } catch (error) {
    next(error);
  }
});

// Admin only route to delete a specific product from the database.
productsRouter.delete("/:productId", adminRequired, async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Products.deleteProduct(productId);

    res.send({
      message: "Product successfully deleted from the database.",
      product,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;
