import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import { jwtAuth } from '../middleware/auth.midd.js';

const router = Router();

router.get('/', jwtAuth(false), postController.getPosts);
router.get('/:id', jwtAuth(true), postController.getPost);
router.post('/', jwtAuth(false), postController.createPost);
router.put('/:id', jwtAuth(true), postController.updatePost);
router.delete('/:id', jwtAuth(true), postController.deletePost);

export default router;