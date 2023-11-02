const mongoose = require('mongoose');
const Product = require('../models/products');
const Category = require('../models/category');
const HttpError = require('../models/http-error');

//listar todos los productos
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

//listar productos por categoria
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
//listar por Id
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

const deleteProductById = async (req, res, next) => {
  const productId = req.params.p_id;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError('Could not find product for this id.', 404);
    return next(error);
  }

  try {
    await Product.deleteOne({ _id: productId });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted product.' });
};

const updateProductById = async (req, res, next) => {
  const { name, price, brand, description, category_id } = req.body;
  const p_id = req.params.p_id;

  let product;
  try {
    product = await Product.findById(p_id);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError('Could not find product for this id.', 404);
    return next(error);
  }

  // si existe category_id en el body verifica si coincide con las categorias existentes, si el body no presenta categoria actualiza el objeto sin categoria_id

  if(category_id){
    let category;
    try {
      category = await Category.findById(category_id);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update product.',
        500
      );
      return next(error);
    }

    if (!category) {
      const error = new HttpError('Could not find category for this id.', 404);
      return next(error);
    }
  }

  // Actualiza los campos del producto
  product.name = name;
  product.price = price;
  product.brand = brand;
  product.description = description;
  product.category_id = category_id; // Actualiza la categoría si es necesario

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }

  // Construye la respuesta sin el campo adicional "id"
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
