import express from 'express';
const router = express.Router();
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

router.get('/', protectRoute, getCartProducts);
router.post('/', protectRoute, addToCart);
router.delete('/', protectRoute, removeAllFromCart);
router.put('/:id', protectRoute, updateQuantity);

export default router