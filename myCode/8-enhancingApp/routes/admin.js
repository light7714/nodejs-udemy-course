const express = require("express");

const productsController = require("../controllers/products");

const router = express.Router();

// /admin/add-product => GET
//not changing the route (in mvc), just importing the a fn which will enable us to get all we need to add a product
//remember, not calling the fn hre, we just pass it and it'll be called whenever a req reaches it.
router.get("/add-product", productsController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", productsController.postAddProduct);

// module.exports = router;
module.exports = router;
