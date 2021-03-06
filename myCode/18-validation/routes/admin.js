const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//We can add as many req handlers as we want, teh req will be funelled from left to right
//* /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

//* /admin/add-product => POST
router.post(
	'/add-product',
	[
		//isAlphanumeric gives error on any whitespace, we dont want that 
		body('title').isString().isLength({ min: 3 }).trim(),
		body('imageUrl').isURL(),
		body('price').isFloat(),
		body('description').isLength({ min: 5, max: 400 }).trim(),
	],
	isAuth,
	adminController.postAddProduct
);

// * /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

//* /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

//* /admin/edit-product => POST
router.post(
	'/edit-product',
	[
		body('title').isString().isLength({ min: 3 }).trim(),
		body('imageUrl').isURL(),
		body('price').isFloat(),
		body('description').isLength({ min: 5, max: 400 }).trim(),
	],
	isAuth,
	adminController.postEditProduct
);

//* /admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
