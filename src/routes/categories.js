const {Router} = require ('express');
const router = Router();
const categoriesController = require('../controllers/categories.controller');
const categoriesValidator = require('../validators/categories.validators');
const categoryValidation = require('../validators/categories.validators');

router.route('/').get(categoriesController.getCategories);
router.route('/:c_id').get(categoryValidation.paramIdValidation, categoriesController.getCategoryById);
router.route('/').post(categoriesValidator.createCategory, categoriesController.createCategory);
router.route('/:c_id').delete(categoryValidation.paramIdValidation, categoriesController.deleteCategoryById);
router.route('/:c_id').put(categoryValidation.paramIdValidation, categoriesValidator.updateCategory, categoriesController.updateCategoryById);

module.exports = router;