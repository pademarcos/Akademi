const mongoose = require("mongoose");
const Product = require("../models/products");
const Category = require("../models/category");
const HttpError = require("../models/http-error");
const { validationResult } = require('express-validator');
// const { createProductValidation } = require('../validators/products.validators');
// const { updateProductValidation } = require('../validators/products.validators');

//listar todos los productos
const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Product.",
      500
    );
    return next(error);
  }

  if (products.length === 0) {
    const error = new HttpError("Could not find products", 404);
    return next(error);
  }
  res.json({ products });
};

//listar productos por categoria
const getProductsByCategoryId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }
  
  const { c_id } = req.params;
  let products;
  try {
    products = await Product.find({ category_id: c_id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Product.",
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
};

//listar productos por Id
const getProductById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }
  const { p_id } = req.params;
  let product;
  try {
    product = await Product.findById(p_id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Product.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(`Could not find product with id ${p_id}`, 404);
    return next(error);
  }
  res.json({ product });
};

//Crear producto
const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const { name, price, brand, description, category_id } = req.body;

   // Verificar si un producto con los mismos atributos ya existe
   let existingProduct;
   try {
     existingProduct = await Product.findOne({ name, brand, description, category_id });
   } catch (err) {
     const error = new HttpError(
       "Creating product failed, please try again.",
       500
     );
     return next(error);
   }
 
   if (existingProduct) {
     const error = new HttpError("A product with the same attributes already exists.", 422);
     return next(error);
   }

  const createdProduct = new Product({
    name,
    price,
    brand,
    description,
  });

  let category;

  if (category_id) {
    try {
      category = await Category.findById(category_id);
    } catch (err) {
      const error = new HttpError(
        "Creating product failed, please try again.",
        500
      );
      return next(error);
    }

    if (!category) {
      const error = new HttpError(
        "Could not find category for provided id.",
        404
      );
      return next(error);
    }
    createdProduct.category_id = category;
  }

  try {
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

//Eliminar producto
const deleteProductById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const productId = req.params.p_id;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Could not find product for this id.", 404);
    return next(error);
  }

  try {
    await Product.deleteOne({ _id: productId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted product." });
};

//Actualizar producto
const updateProductById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const { name, price, brand, description, category_id } = req.body;
  const p_id = req.params.p_id;

  let product;
  try {
    product = await Product.findById(p_id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Could not find product for this id.", 404);
    return next(error);
  }

  let existingCategory;

  if (category_id !== undefined) { // Si se proporcionó un nuevo category_id
    try {
      existingCategory = await Category.findById(category_id);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not check the category.",
        500
      );
      return next(error);
    }

    if (!existingCategory) {
      const error = new HttpError("Could not find category for the provided id.", 404);
      return next(error);
    }
  }

  // Validar las actualizaciones de campos
  if (name) product.name = name;
  if (price) product.price = price;
  if (brand) product.brand = brand;
  if (description) product.description = description;
  if (category_id) product.category_id = category_id;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product.",
      500
    );
    return next(error);
  }

  const productResponse = {
    name: product.name,
    price: product.price,
    brand: product.brand,
    description: product.description,
    category_id: product.category_id,
  };

  res.status(200).json({ product: productResponse });
};


exports.getProducts = getProducts;
exports.getProductsByCategoryId = getProductsByCategoryId;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.deleteProductById = deleteProductById;
exports.updateProductById = updateProductById;
