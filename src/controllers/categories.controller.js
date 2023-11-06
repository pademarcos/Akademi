const mongoose = require("mongoose");
const Product = require("../models/products");
const Category = require("../models/category");
const HttpError = require("../models/http-error");
const { validationResult } = require('express-validator');

//Listar categorias.
const getCategories = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  let categories;
  try {
    categories = await Category.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Category.",
      500
    );
    return next(error);
  }

  if (categories.length === 0) {
    const error = new HttpError("Could not find categories", 404);
    return next(error);
  }
  res.json({ categories });
};

//Listar categorias por id.
const getCategoryById = async (req, res, next) => {
  const { c_id } = req.params;
  let category;
  try {
    category = await Category.findById(c_id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Category.",
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError(`Could not find category with id ${c_id}`, 404);
    return next(error);
  }
  res.json({ category });
};

//Crear categoria.
const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const { name } = req.body;

  try {
    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new HttpError('Category already exists.', 422));
    }
  } catch (err) {
    const error = new HttpError("Creating category failed, please try again.", 500);
    return next(error);
  }

  const createdCategory = new Category({
    name
  });

  try {
    await createdCategory.save();
  } catch (err) {
    const error = new HttpError(
      "Creating category failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ category: createdCategory });
};

//Eliminar categoria.
const deleteCategoryById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }

  const { c_id } = req.params;
let category
  try {
  category = await Category.findById(c_id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category.",
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError("Could not find category for this id.", 404);
    return next(error);
  }

  // Verificar si existen productos con la categoría que se va a eliminar
  let productsWithCategory;
  try {
    productsWithCategory = await Product.find({ category_id: c_id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while checking for products with this category.",
      500
    );
    return next(error);
  }

  if (productsWithCategory.length > 0) {
    try {
      await Product.updateMany({ category_id: c_id }, { $set: { category_id: null } });
    } catch (err) {
      const error = new HttpError("Something went wrong while updating products.", 500);
      return next(error);
    }
  }

  // Si no hay productos con esta categoría, procede a eliminar la categoría
  try {
    await Category.deleteOne({ _id: c_id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted category." });
};

//Actualiza categoria.
const updateCategoryById = async (req, res, next) => {

  const { name } = req.body;
  const c_id = req.params.c_id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new HttpError(errorMessages.join(', '), 400));
  }


  try {
    const existingCategory = await Category.findOne({ name, _id: { $ne: c_id } });
    if (existingCategory) {
      return next(new HttpError('Category with the same name already exists.', 422));
    }
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update category.', 500);
    return next(error);
  }

  let category;
  try {
    category = await Category.findById(c_id);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update category.',
      500
    );
    return next(error);
  }

  category.name = name;

  try {
    await category.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update category.',
      500
    );
    return next(error);
  }

  const categoryResponse = {
    name: category.name,
  };

  res.status(200).json({ category: categoryResponse });
};

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.deleteCategoryById = deleteCategoryById;
exports.updateCategoryById = updateCategoryById;
