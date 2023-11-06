const {Router} = require ('express');
const router = Router();
const productsController = require('../controllers/products.controller');
const productValidation = require('../validators/products.validators');
const categoryValidation = require('../validators/categories.validators');

router.route('/').get(productsController.getProducts);
router.route('/category/:c_id').get(categoryValidation.paramIdValidation, productsController.getProductsByCategoryId);
router.route('/:p_id').get(productValidation.paramIdValidation, productsController.getProductById);
router.route('/').post(productValidation.createProductValidation, productsController.createProduct);
router.route('/:p_id').delete(productValidation.paramIdValidation, productsController.deleteProductById);
router.route('/:p_id').put(productValidation.paramIdValidation, productValidation.updateProductValidation, productsController.updateProductById);

module.exports = router;