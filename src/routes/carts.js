const {Router} = require ('express');
const router = Router();
const cartController = require('../controllers/cart.controller');
const cartValidation = require('../validators/cart.validators');

router.route('/').get(cartController.getCarts);
router.route('/:cartId').get(cartValidation.paramIdValidation, cartController.getCartById);
router.route('/').post(cartController.createCart);
router.route('/:cartId').post(cartValidation.paramIdValidation, cartValidation.UpdateProductInCartValidation, cartController.addProductToCart);
router.route('/:cartId').put(cartValidation.paramIdValidation, cartValidation.UpdateProductInCartValidation, cartController.updateProductInCart);
router.route('/:cartId/delete/:productId').delete(cartValidation.paramIdValidation, cartValidation.paramProductIdValidation, cartController.removeProductFromCart);
router.route('/:cartId').delete(cartValidation.paramIdValidation, cartController.removeCart);

module.exports = router;