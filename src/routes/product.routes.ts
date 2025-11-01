import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Create a new product (with image upload)
router.post('/', upload.single('image'), createProduct);

// Get all products or search products
router.get('/', getProducts);

// Get a single product by ID
router.get('/:productId', getProductById);

// Update a product by ID
router.put('/:productId', updateProduct);

// Delete a product by ID
router.delete('/:productId', deleteProduct);

export default router;
