const express = require('express');
const cors = require('cors');
const app = express();
const productsRoute = require('./routes/products');

//settings
app.set('port', process.env.PORT || 3000);

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/products', productsRoute)

module.exports = app