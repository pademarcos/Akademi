const Product = require('../models/products');
const HttpError = require('../models/http-error');

const getProducts = async (req, res, next) =>  {
    let product;
    try {
      product = await Product.find({});
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a Product.',
        500
      );
      return next(error);
    }
    // console.log(product)
    if (!product) {
      const error = new HttpError(
        'Could not find product',
        404
      );
      return next(error);
    }
    res.json({ product });
}

exports.getProducts = getProducts;
