
const { check } = require('express-validator');
const createProductValidation = [
    check('name').isString().withMessage('Name must be a string'),
    check('price').isFloat().withMessage('Price must be a number'),
    check('brand').isString().withMessage('Brand must be a string'),
    check('description').isString().withMessage('Description must be a string'),
    check('category_id').isMongoId().withMessage('Category ID must be a valid'),
  ];

  exports.createProductValidation = createProductValidation;
