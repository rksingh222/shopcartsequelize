const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//if a specific router is there such as /products/delete then that should be placed before :productId route
router.get('/products/:productId',shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);
router.post('/cart/add',shopController.addQtyPostCart);

//router.get('/cart/:productId')

//router.post('/addqty-cart-item', shopController.addQtyPostCart);

//router.post ('/deleteqty-cart-item', shopController.delOneQtyPostCart);

router.post('/delete-cart-item', shopController.deletePostCart);

router.get('/orders', shopController.getOrders);

router.post('/cart-order', shopController.postOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
