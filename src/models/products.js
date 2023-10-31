const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pid:{type: Number, required: true},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand:{ type: String, required: true},
    category: { type: mongoose.Types.ObjectId, required: false, ref: 'Category' }
});

module.exports = mongoose.model('Product', productSchema);