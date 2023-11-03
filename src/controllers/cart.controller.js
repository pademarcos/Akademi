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
    const cartId = req.params.cartId;
    const { productId, quantity } = req.body;
  
    // Busca el carrito específico en la base de datos utilizando el cartId
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
  
    // Verificar si el producto ya está en el carrito
    const cartProduct = cart.products.find((item) => item.productId.toString() === productId);
  
    if (cartProduct) {
      // Si el producto ya existe en el carrito, actualiza la cantidad
      cartProduct.quantity += quantity;
  
      // Calcula el nuevo precio total del producto
      const product = await Product.findById(productId);
      if (!product) {
        const error = new HttpError("Could not find the product with the provided ID.", 404);
        return next(error);
      }
  
      cartProduct.totalItemPrice = product.price * cartProduct.quantity;
    } else {
      // Si el producto no está en el carrito, agrégalo como un nuevo elemento
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
  
      // Calcula el precio total del nuevo producto
      const totalItemPrice = product.price * quantity;
      cart.products.push({
        productId: productId,
        quantity: quantity,
        totalItemPrice: totalItemPrice,
      });
    }
  
    // Actualiza el precio total del carrito
    cart.totalPrice = cart.products.reduce((total, item) => total + item.totalItemPrice, 0);
  
    // Guarda el carrito con el producto actualizado o agregado
    try {
      await cart.save();
    } catch (err) {
      const error = new HttpError("Error saving the cart.", 500);
      return next(error);
    }
  
    res.status(201).json({ cart });
  };
  

  const updateProductInCart = async (req, res, next) => {
    const cartId = req.params.cartId;
    const { productId, quantity } = req.body;
  
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        const error = new HttpError("Could not find the cart with the provided ID.", 404);
        return next(error);
      }
  
      // Verifica si el producto ya está en el carrito
      const cartProduct = cart.products.find((item) => item.productId.toString() === productId);
  
      if (!cartProduct) {
        const error = new HttpError("The product is not in the cart.", 404);
        return next(error);
      }
  
      // Actualiza la cantidad y el precio total del producto en el carrito
      const product = await Product.findById(productId);
      if (!product) {
        const error = new HttpError("Could not find the product with the provided ID.", 404);
        return next(error);
      }
  
      // Calcula el nuevo precio total del producto
      const totalItemPrice = product.price * quantity;
  
      // Actualiza la cantidad y el precio total del producto en el carrito
      cartProduct.quantity = quantity;
      cartProduct.totalItemPrice = totalItemPrice;
  
      // Actualiza el precio total del carrito
      cart.totalPrice = cart.products.reduce((total, item) => total + item.totalItemPrice, 0);
  
      await cart.save();
      res.status(200).json({ cart });
    } catch (err) {
      const error = new HttpError("Error updating the product in the cart.", 500);
      return next(error);
    }
  };

  const removeProductFromCart = async (req, res, next) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId; // Asumiendo que pasas el ID del producto a eliminar en la URL
  
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        const error = new HttpError("Could not find the cart with the provided ID.", 404);
        return next(error);
      }
  
      // Buscar el índice del producto en el carrito
      const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
  
      if (productIndex === -1) {
        const error = new HttpError("The product is not in the cart.", 404);
        return next(error);
      }
  
      // Elimina el producto del carrito
      cart.products.splice(productIndex, 1);
  
      // Actualiza el precio total del carrito
      cart.totalPrice = cart.products.reduce((total, item) => total + item.totalItemPrice, 0);
  
      await cart.save();
  
      res.status(200).json({ message: `Product removed from cart: ${productId}` });
    } catch (err) {
      const error = new HttpError("Error deleting the product from the cart.", 500);
      return next(error);
    }
  };
  
  const removeCart = async (req, res, next) => {
    const cartId = req.params.cartId;
  
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        const error = new HttpError("Could not find the cart with the provided ID.", 404);
        return next(error);
      }
  
      // Verificar si el carrito está vacío
      if (cart.products.length === 0) {
        // Si el carrito está vacío, elimina el carrito
        await Cart.findByIdAndRemove(cartId);
        res.status(200).json({ message: "Cart removed." });
      } else {
        res.status(200).json({ message: "Cart is not empty, cannot be removed." });
      }
    } catch (err) {
      const error = new HttpError("Error removing the cart.", 500);
      return next(error);
    }
  };
  
  exports.getCarts = getCarts;
  exports.addProductToCart = addProductToCart;
  exports.createCart = createCart;
  exports.updateProductInCart = updateProductInCart;
  exports.removeProductFromCart = removeProductFromCart;
  exports.removeCart = removeCart;