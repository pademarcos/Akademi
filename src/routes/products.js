const {Router} = require ('express');
const router = Router();
const productsController = require('../controllers/products.controller')

router.route('/').get(productsController.getProducts);
router.route('/category/:c_id').get(productsController.getProductsByCategoryId);
router.route('/:p_id').get(productsController.getProductById);
router.route('/').post(productsController.createProduct);
router.route('/:p_id').delete(productsController.deleteProductById);
router.route('/:p_id').put(productsController.updateProductById);

module.exports = router;