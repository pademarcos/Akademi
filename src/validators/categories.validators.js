const { Router } = require('express');
const router = Router();
const { check, param } = require('express-validator');

// Validaciones para crear una categoría
const createCategory = [
  check('name').isString().isLength({ min: 3 }).withMessage('The name should be a String of at least 3 characters'),
]

const updateCategory = [
  check('name').isString().isLength({ min: 3 }).withMessage('The name should be a String of at least 3 characters'),
]

const paramIdValidation = [
  param('c_id').isMongoId().withMessage('Category ID must be a valid'),
];



exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.paramIdValidation = paramIdValidation;