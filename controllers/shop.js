const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch((err) => {
    console.log(err)
  });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  console.log(id);

  Product.findAll({ where: { id: id } }).then((product) =>
    //here we are recieving an array and hence i am sending the array with index 0
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: 'Product Detail',
      path: '/product-detail'
    })
  ).catch((err) => {
    console.log(err);
  })

}

exports.getIndex = (req, res, next) => {

  Product.findAll().then((products) => {
    console.log("test products");
    for (let product of products) {
      console.log(product.id);
    }
    console.log("test products");
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((err) => {
    console.log("error")
    console.log(err);
    console.log("error");
  });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((cart) => {
    return cart.getProducts().then((products) => {
      console.log(products);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })
  /*Cart.getProducts(carts => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        cartProductData = carts.products.find(prod => prod.id == product.id)
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty })
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
  })*/
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let newQuantity = 1;
  let fetchedCart;
  req.user.getCart().then((cart) => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } })
  }).then((products) => {
    let product;
    if (products.length > 0) {
      product = products[0]
    }
    if (product) {
      //already exist
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product
    }
    return Product.findByPk(prodId);
  }).then(product => {
    return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
  }).then(() => {
    res.redirect('/cart');
  }).catch((err) => {
    console.log(err);
  })

  res.redirect('/cart');
};

exports.addQtyPostCart = (req, res, next) => {
  //const prodId = req.params.productId;

  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.increaseQuantity(prodId, product.price);
    res.redirect('/cart');
  });

}

exports.delOneQtyPostCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.decreaseQuantity(prodId, product.price);
    console.log("in redirect")
    res.redirect('/cart');
  });

}

exports.deletePostCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then((cart) => {
    return cart.getProducts()
  }).then((products) => {
    let product = products[0];
    return product.cartItem.destroy();
  }).then((result) => {
    res.redirect('/cart');
  }).catch((err) => {
    console.log(err);
  })
}


exports.postOrders = (req, res, next) => {
  let fetchedCart;
  req.user.getCart().then(cart => {
    fetchedCart = cart;
    return cart.getProducts();
  }).then(products => {
    req.user.createOrder().then((order) => {
      order.addProducts(products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      }))
    }).then(result =>{
      //setting the products to null so that in the fetchedcart there are no products
      return fetchedCart.setProducts(null);
    }).then(result =>{
      res.redirect('/orders');
    }).catch(err => {
      console.log(err);
    })
  }).catch(err => {
    console.log(err);
  })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] }).then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  }).catch(err => {
    console.log(err);
  })


};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
