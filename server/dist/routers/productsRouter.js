import { Router } from "express";
import { check } from 'express-validator';
import ProductController from "../controllers/ProductController.js";
const router = Router();
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', [
    check('name').notEmpty().withMessage('Product name is required'),
    check('description').notEmpty().withMessage('Product description is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
], ProductController.createProduct);
router.put('/products/:id', [
    check('name').notEmpty().withMessage('Product name is required'),
    check('description').notEmpty().withMessage('Product description is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
], ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);
export default router;
//# sourceMappingURL=productsRouter.js.map