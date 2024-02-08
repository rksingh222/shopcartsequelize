const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  //req.query is ?edit=true
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect('/');
  }
  else {
    //req.param = url/12345 == the productid is the req.param.productId
    const prodId = req.params.productId;
     //Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); 
     //this is why we can call this
    req.user.getProducts({where: { id: prodId} }).then((product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product[0],
        editing: editMode
      });
    }).catch((err) => {
      console.log(err);
    })
/*
    Product.findByPk(prodId).then((product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product,
        editing: editMode
      });
    }).catch((err) => {
      console.log(err);
    })
    */
  }

}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findByPk(prodId).then((product)=>{
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.description = updatedDescription;
    return product.save()
  }).then((result)=> {
    console.log("Updated Products");
    res.redirect('/admin/products');
  }).catch((err)=> {
    console.log(err);
  })

}


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  //Product.create({ title: title, description: description, price: price, imageUrl: imageUrl, user : req.user.id});
  //Since we have the property 
  //Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
  req.user.createProduct({ title: title, description: description, price: price, imageUrl: imageUrl }).then((result) => {
    console.log("Sucessful")
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });
  res.redirect('/');
};

exports.postDeleteProduct = (req, res, next) => {
  const prodID = req.body.productId;
  Product.findByPk(prodID).then((product)=> {
    return product.destroy();
  }).then((result)=>{
    res.redirect('/admin/products');
  }).catch((err) => {
    console.log(err);
  })
}


exports.getProducts = (req, res, next) => {
  req.user.getProducts().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch((err) => {
    console.log(err);
  })

}
