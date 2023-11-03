const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

// Validaciones para crear una categoría
createCategory = [
  check('name').isString().isLength({ min: 3 }),
]

updateCategory = [
  check('name').isString().isLength({ min: 3 }),
]


exports.createCategory = createCategory;
exports.updateCategory = updateCategory;