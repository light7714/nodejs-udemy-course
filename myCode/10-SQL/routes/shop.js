const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

//Express router knows that :id means there'll be a variable segment, and later we can refer it by id
//you cannot put a static route below a dynamic route with a same segment before the dynamic part. like if we had router.get("/products/delete"); below /products/:productId, then a get req to /product/delete will instead go thru :productId route as it'll think delete keyword is also dynamic. (Just mentioning)
// router.get("/products/delete");
router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
