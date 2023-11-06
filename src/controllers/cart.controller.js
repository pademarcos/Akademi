const mongoose = require("mongoose");
const Product = require("../models/products");
const Category = require("../models/category");
const HttpError = require("../models/http-error");
const Cart = require("../models/cart");
const { validationResult } = require('express-validator');

//Lista los carritos
const getCarts = async (req, res, next) => {
  let carts;
  try {
    carts = await Cart.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Cart.",
      500
    );
    return next(error);
  }

  if (carts.length === 0) {
    const error = new HttpError("Could not find cart", 404);
    return next(error);
  }
  res.json({ carts });
};

//Crear un Carrito
const createCart = async (req, res, next) => {
  const newCart = new Cart({
    products: [],
    totalPrice: 0,
  });

  try {
    await newCart.save();
  } catch (err) {
    const error = new HttpError("Error creating a new cart", 500);
    return next(error);
  }

  res.status(201).json({ cart: newCart });
};

//Agrega producto al carrito
const addProductToCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const cartId = req.params.cartId;
  const { productId, quantity } = req.body;

  let cart;
  try {
    cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new HttpError(
        "Could not find the cart with the provided ID.",
        404
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Error searching for the cart.", 500);
    return next(error);
  }

  // Verificar si el producto ya está en el carrito
  const cartProduct = cart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (cartProduct) {
    // Si el producto ya existe en el carrito, actualiza la cantidad
    cartProduct.quantity += quantity;

    // Calcula el nuevo precio total del producto
    const product = await Product.findById(productId);
    if (!product) {
      const error = new HttpError(
        "Could not find the product with the provided ID.",
        404
      );
      return next(error);
    }

    cartProduct.totalItemPrice = product.price * cartProduct.quantity;
  } else {
    // Si el producto no está en el carrito, se agrega como un nuevo elemento
    let product;
    try {
      product = await Product.findById(productId);
      if (!product) {
        const error = new HttpError(
          "Could not find the product with the provided ID.",
          404
        );
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("Error searching for the product.", 500);
      return next(error);
    }

    // Calcula el precio total
    const totalItemPrice = product.price * quantity;
    cart.products.push({
      productId: productId,
      quantity: quantity,
      totalItemPrice: totalItemPrice,
    });
  }

  // Actualiza el precio total del carrito
  cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.totalItemPrice,
    0
  );

  // Guarda el carrito con el producto actualizado o agregado
  try {
    await cart.save();
  } catch (err) {
    const error = new HttpError("Error saving the cart.", 500);
    return next(error);
  }

  res.status(201).json({ cart });
};

//Actualiza (la cantidad) de un producto en el carrito
const updateProductInCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const cartId = req.params.cartId;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new HttpError(
        "Could not find the cart with the provided ID.",
        404
      );
      return next(error);
    }

    // Verifica si el producto ya está en el carrito
    const cartProduct = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartProduct) {
      const error = new HttpError("The product is not in the cart.", 404);
      return next(error);
    }

    // Actualiza la cantidad y el precio total del producto en el carrito
    const product = await Product.findById(productId);
    if (!product) {
      const error = new HttpError(
        "Could not find the product with the provided ID.",
        404
      );
      return next(error);
    }

    // Calcula el nuevo precio total del producto
    const totalItemPrice = product.price * quantity;

    // Actualiza la cantidad y el precio total del producto en el carrito
    cartProduct.quantity = quantity;
    cartProduct.totalItemPrice = totalItemPrice;

    // Actualiza el precio total del carrito
    cart.totalPrice = cart.products.reduce(
      (total, item) => total + item.totalItemPrice, 0);

    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    const error = new HttpError("Error updating the product in the cart.", 500);
    return next(error);
  }
};

//Elimina un producto del carrito
const removeProductFromCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const cartId = req.params.cartId;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new HttpError(
        "Could not find the cart with the provided ID.",
        404
      );
      return next(error);
    }

    // Buscar el índice del producto en el carrito
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      const error = new HttpError("The product is not in the cart.", 404);
      return next(error);
    }

    // Elimina el producto del carrito
    cart.products.splice(productIndex, 1);

    // Actualiza el precio total del carrito
    cart.totalPrice = cart.products.reduce(
      (total, item) => total + item.totalItemPrice,
      0
    );

    await cart.save();

    res
      .status(200)
      .json({ message: `Product removed from cart: ${productId}` });
  } catch (err) {
    const error = new HttpError(
      "Error deleting the product from the cart.",
      500
    );
    return next(error);
  }
};

//Elimina el carrito.
const removeCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }
  
  const cartId = req.params.cartId;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new HttpError(
        "Could not find the cart with the provided ID.",
        404
      );
      return next(error);
    }

    await Cart.findByIdAndRemove(cartId);
    res.status(200).json({ message: "Cart removed." });
  } catch (err) {
    const error = new HttpError("Error removing the cart.", 500);
    return next(error);
  }
};

const getCartById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const cartId = req.params.cartId; // Obten el ID del carrito desde los parámetros de la solicitud

  try {
    const cart = await Cart.findById(cartId); // Busca el carrito por su ID
    if (!cart) {
      const error = new HttpError(
        "Could not find the cart with the provided ID.",
        404
      );
      return next(error);
    }

    res.json({ cart }); // Devuelve el carrito encontrado
  } catch (err) {
    const error = new HttpError("Error retrieving the cart.", 500);
    return next(error);
  }
};

exports.getCarts = getCarts;
exports.addProductToCart = addProductToCart;
exports.createCart = createCart;
exports.updateProductInCart = updateProductInCart;
exports.removeProductFromCart = removeProductFromCart;
exports.removeCart = removeCart;
exports.getCartById = getCartById;
