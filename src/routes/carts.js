const {Router} = require ('express');
const router = Router();
const cartController = require('../controllers/cart.controller');

router.route('/').get(cartController.getCarts);
router.route('/').post(cartController.createCart);
router.route('/:cartId').post(cartController.addProductToCart);
router.route('/:cartId').put(cartController.updateProductInCart);
router.route('/:cartId/delete/:productId').delete(cartController.removeProductFromCart);
router.route('/:cartId').delete(cartController.removeCart);

module.exports = router;