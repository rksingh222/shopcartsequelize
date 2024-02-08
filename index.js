const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// this is middleware which is not called on npm start
// but this gets called when a request is made in the url
app.use((req, res, next)=>{
    User.findByPk(1).then(user => {
        req.user = user;
        next()
    }).catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//this means on deletion of user the product linked with user is also deleted
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product)
// In the Cart Table Userid is also created with this statement
User.hasOne(Cart);
Cart.belongsTo(User);

//its a many to many relationship because one cart can hold many product and one product can be part of multiple carts
//through key is added means where these connection should be store 
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//One user can have multiple orders
//One order can hold multiple products through OrderItem 
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


//inside sync if we give force: true it creates table 
sequelize.sync().then(result =>{
    return User.findByPk(1)
    
}).then(user => {
    // return user if user exist 
    // it will return user if user gets created
    if (!user){
        return User.create({name: 'Rahul',email: "Rahul.singh@gmail.com"})
    }
    return user;
}).then((user)=>{
    user.createCart();
}).then((cart) =>{
    app.listen(PORT,() =>{
        console.log(`Listening on PORT ${PORT}`);
    });
}).catch(err => {
    console.log("error");
    console.log(err);
})


const filePath = path.join("/tmp","data.json");
console.log(filePath);