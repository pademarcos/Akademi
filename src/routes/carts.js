const {Router} = require ('express');
const router = Router();
const cartController = require('../controllers/cart.controller');

router.route('/').get(cartController.getCarts);
router.route('/').post(cartController.createCart);
router.route('/').post(cartController.addProductToCart);

module.exports = router;