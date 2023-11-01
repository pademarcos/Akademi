const mongoose = require('mongoose');
const Product = require('../models/products');
const Category = require('../models/category');
const HttpError = require('../models/http-error');

const getCategories = async (req, res, next) =>  {
    let categories;
    try {
      categories = await Category.find({});
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a Category.',
        500
      );
      return next(error);
    }

    if (categories.length === 0) {
      const error = new HttpError(
        'Could not find categories',
        404
      );
      return next(error);
    }
    res.json({ categories });
};

const getCategoryById = async (req, res, next) =>  {
    const { c_id } = req.params
    let category;
    try {
      category = await Category.findById(c_id);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a Category.',
        500
      );
      return next(error);
    }
  
    if (!category) {
      const error = new HttpError(
        `Could not find category with id ${c_id}`,
        404
      );
      return next(error);
    }
    res.json({ category });
  };

  const createCategory = async (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return next(
    //     new HttpError('Invalid inputs passed, please check your data.', 422)
    //   );
    // }
  
    const { name } = req.body;
  
    const createdCategory = new Category({
      name
    });
  
    try {
      await createdCategory.save();
    } catch (err) {
      const error = new HttpError(
        'Creating category failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json({ category: createdCategory });
  };


  const deleteCategoryById = async (req, res, next) => {
    const { c_id } = req.params
  
    let category;
    try {
      category = await Category.findById(c_id);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete category.',
        500
      );
      return next(error);
    }
  
    if (!category) {
      const error = new HttpError('Could not find category for this id.', 404);
      return next(error);
    }
  
    try {
      await category.remove();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete category.',
        500
      );
      return next(error);
      }
  
    res.status(200).json({ message: 'Deleted category.' });
  };
  

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.deleteCategoryById = deleteCategoryById;
