const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  products: [
    {
      productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, },
      quantity: {type: Number, required: true, },
      totalItemPrice: {type: Number, required: true, },
    },
  ],
  totalPrice: {type: Number, required: true, },
  
},{ versionKey: false });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
