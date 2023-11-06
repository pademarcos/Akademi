const { param, check } = require('express-validator');

const paramIdValidation = [
  param('cartId').isMongoId().withMessage('Cart ID must be a valid'),
];

const paramProductIdValidation = [
    param('productId').isMongoId().withMessage('Product ID must be a valid'),
  ];

const UpdateProductInCartValidation = [
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    check('productId').isMongoId().withMessage('Product ID must be a valid')
]


exports.paramIdValidation = paramIdValidation;
exports.paramProductIdValidation = paramProductIdValidation;
exports.UpdateProductInCartValidation = UpdateProductInCartValidation;