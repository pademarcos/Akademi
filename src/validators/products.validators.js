
const { check, param } = require('express-validator');
const createProductValidation = [
  check('name').isString().withMessage('Name must be a string'),
  check('price').isFloat().withMessage('Price must be a number'),
  check('brand').isString().withMessage('Brand must be a string'),
  check('description').isString().withMessage('Description must be a string'),
  check('category_id').optional().isMongoId().withMessage('Category ID must be a valid'),
];

const updateProductValidation = [
  check('name').optional().isString().withMessage('Name must be a string'),
  check('price').optional().isFloat().withMessage('Price must be a number'),
  check('brand').optional().isString().withMessage('Brand must be a string'),
  check('description').optional().isString().withMessage('Description must be a string'),
  check('category_id').optional().isMongoId().withMessage('Category ID must be a valid'),
];
  
const paramIdValidation = [
  param('p_id').isMongoId().withMessage('Product ID must be a valid'),
];

exports.createProductValidation = createProductValidation;
exports.updateProductValidation = updateProductValidation;
exports.paramIdValidation = paramIdValidation;

