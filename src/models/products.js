const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand:{ type: String, required: true},
    description:{ type: String, required: true},
    category_id: { type: mongoose.Types.ObjectId, required: false, ref: 'Category' }
}, { versionKey: false });

module.exports = mongoose.model('Product', productSchema);