const {Router} = require ('express');
const router = Router();
const categoriesController = require('../controllers/categoriesController');

router.route('/').get(categoriesController.getCategories);
router.route('/:c_id').get(categoriesController.getCategoryById);
router.route('/').post(categoriesController.createCategory);
router.route('/:c_id').delete(categoriesController.deleteCategoryById);
router.route('/:c_id').put(categoriesController.updateCategoryById);

module.exports = router;