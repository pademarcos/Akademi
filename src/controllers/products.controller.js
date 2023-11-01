const mongoose = require('mongoose');
const Product = require('../models/products');
const Category = require('../models/category');
const HttpError = require('../models/http-error');

const getProducts = async (req, res, next) =>  {
    let products;
    try {
      products = await Product.find({});
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a Product.',
        500
      );
      return next(error);
    }

    if (products.length === 0) {
      const error = new HttpError(
        'Could not find products',
        404
      );
      return next(error);
    }
    res.json({ products });
};

const getProductsByCategoryId = async (req, res, next) =>  {
  const { c_id } = req.params
  let products;
  try {
    products = await Product.find({ category_id: c_id });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Product.',
      500
    );
    return next(error);
  }

  if (products.length === 0) {
    const error = new HttpError(
      `Could not find products with category_id ${c_id}`,
      404
    );
    return next(error);
  }
  res.json({ products });
}

const getProductById = async (req, res, next) =>  {
  const { p_id } = req.params
  let product;
  try {
    product = await Product.findById(p_id);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Product.',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      `Could not find product with id ${p_id}`,
      404
    );
    return next(error);
  }
  res.json({ product });
}

const createProduct = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError('Invalid inputs passed, please check your data.', 422)
  //   );
  // }

  const { name, price, brand, description, category_id } = req.body;

  const createdProduct = new Product({
    name,
    price,
    brand,
    description,
    category_id
  });

  let category;
  
  if(category_id){
    try {
      category = await Category.findById(category_id);
    } catch (err) {
      const error = new HttpError(
        'Creating product failed, please try again.',
        500
      );
      return next(error);
    }

    if (!category) {
      const error = new HttpError('Could not find category for provided id.', 404);
      return next(error);
    }
  }

  try {
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      'Creating product failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};




exports.getProducts = getProducts;
exports.getProductsByCategoryId = getProductsByCategoryId;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
