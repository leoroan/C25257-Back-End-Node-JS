import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { jwtAuth } from '../middleware/auth.midd.js';

const router = Router();

router.get('/', jwtAuth(false), productController.getProducts);
router.get('/:id', jwtAuth(true), productController.getProduct);
router.post('/', jwtAuth(true), productController.createProduct);
router.put('/:id', jwtAuth(true), productController.updateProduct);
router.delete('/:id', jwtAuth(true), productController.deleteProduct);
export default router;