const express = require('express');
const cors = require('cors');
const app = express();
const productsRoute = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const cartRoute = require('./routes/carts');

//settings
app.set('port', process.env.PORT || 3000);

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/products', productsRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/carts', cartRoute)

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

module.exports = app