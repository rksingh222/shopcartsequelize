following packages are installed to make this application work
npm install --save mysql2
const mysql = require('mysql2')
npm install --save sequelize ----needs mysql2 package
https://sequelize.org
sequelize.sync()  --- when you sync it creates the model because we have used sequelize.define in product model
