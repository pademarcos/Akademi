const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { createCategory, updateCategoryById } = require('./categories.controller');

// Validaciones para crear una categoría
router.post('/create', [
  check('name').isString().isLength({ min: 3 }).withMessage('The name must be a string of at least 3 characters'),
], createCategory);

// Validaciones para actualizar una categoría
router.put('/update/:c_id', [
  check('name').isString().isLength({ min: 3 }).withMessage('The name must be a string of at least 3 characters'),
], updateCategoryById);

module.exports = router;