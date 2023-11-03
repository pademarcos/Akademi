const {Router} = require ('express');
const router = Router();
const categoriesController = require('../controllers/categories.controller');
const { check } = require('express-validator');


router.route('/').get(categoriesController.getCategories);
router.route('/:c_id').get(categoriesController.getCategoryById);
router.route('/').post([check('name').isString().withMessage('Name must be a string'),], categoriesController.createCategory);
router.route('/:c_id').delete(categoriesController.deleteCategoryById);
router.route('/:c_id').put(categoriesController.updateCategoryById);

module.exports = router;