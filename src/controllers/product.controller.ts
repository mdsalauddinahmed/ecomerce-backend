import { Request, Response } from 'express';
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  searchProductsService,
} from '../services/product.service';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Debug: Log what we receive
    console.log('=== Product Creation Debug ===');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file ? 'File present' : 'No file');
    console.log('============================');

    let imageUrl: string | undefined;

    // Upload image to Cloudinary if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
    }

    // Parse FormData fields
    const productData: any = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : [],
      variants: req.body.variants ? JSON.parse(req.body.variants) : [],
      inventory: req.body.inventory ? JSON.parse(req.body.inventory) : {
        quantity: parseInt(req.body.quantity || '0'),
        inStock: req.body.inStock === 'true' || req.body.inStock === true,
      },
      image: imageUrl,
    };

    // Add categoryData if provided
    if (req.body.categoryData) {
      try {
        productData.categoryData = JSON.parse(req.body.categoryData);
      } catch (e) {
        productData.categoryData = req.body.categoryData;
      }
    }

    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: name, description, price, and category',
      });
    }

    // Create product
    const product = await createProductService(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: product,
    });
  } catch (error: any) {
    console.error('Product creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// Get all products or search products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    let products;
    let message;

    if (searchTerm) {
      // Search products by search term
      products = await searchProductsService(searchTerm as string);
      message = `Products matching search term '${searchTerm}' fetched successfully!`;
    } else {
      // Get all products
      products = await getAllProductsService();
      message = 'Products fetched successfully!';
    }

    res.status(200).json({
      success: true,
      message,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch products',
    });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await getProductByIdService(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully!',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product',
    });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Update product with request body
    const product = await updateProductService(productId, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await deleteProductService(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};
