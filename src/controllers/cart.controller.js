const mongoose = require("mongoose");
const Product = require("../models/products");
const Category = require("../models/category");
const HttpError = require("../models/http-error");
const Cart = require("../models/cart");

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

  const createCart = async (req, res, next) => {
    // Crea un nuevo carrito vacío
    const newCart = new Cart({
      products: [],
      totalPrice: 0,
    });
  
    try {
      await newCart.save();
    } catch (err) {
      const error = new HttpError('Error creating a new cart', 500);
      return next(error);
    }
  
    res.status(201).json({ cart: newCart });
  };

  const addProductToCart = async (req, res, next) => {
    const { cartId, productId, quantity } = req.body;
  
    // Buscar el carrito específico en la base de datos utilizando el cartId
    let cart;
    try {
      cart = await Cart.findById(cartId);
      if (!cart) {
        const error = new HttpError("Could not find the cart with the provided ID.", 404);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("Error searching for the cart.", 500);
      return next(error);
    }
  
    // Buscar el producto que deseas agregar al carrito
    let product;
    try {
      product = await Product.findById(productId);
      if (!product) {
        const error = new HttpError("Could not find the product with the provided ID.", 404);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("Error searching for the product.", 500);
      return next(error);
    }
  
    // Agregar el producto al carrito
    const totalItemPrice = product.price * quantity;
    cart.products.push({
      productId: productId,
      quantity: quantity,
      totalItemPrice: totalItemPrice,
    });
    cart.totalPrice += totalItemPrice;
  
    // Guardar el carrito con el producto agregado
    try {
      await cart.save();
    } catch (err) {
      const error = new HttpError("Error saving the cart.", 500);
      return next(error);
    }
  
    res.status(201).json({ cart });
  };
  

  exports.getCarts = getCarts;
  exports.addProductToCart = addProductToCart;
  exports.createCart = createCart;