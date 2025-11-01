import { Product } from '../models/product.model';

// Create a new product
export const createProductService = async (productData: any) => {
  const product = await Product.create(productData);
  return product;
};

// Get all products
export const getAllProductsService = async () => {
  const products = await Product.find();
  return products;
};

// Get a single product by ID
export const getProductByIdService = async (productId: string) => {
  const product = await Product.findById(productId);
  return product;
};

// Update a product by ID
export const updateProductService = async (
  productId: string,
  productData: any
) => {
  const product = await Product.findByIdAndUpdate(productId, productData, {
    new: true,
    runValidators: true,
  });
  return product;
};

// Delete a product by ID
export const deleteProductService = async (productId: string) => {
  const product = await Product.findByIdAndDelete(productId);
  return product;
};

// Search products by search term
export const searchProductsService = async (searchTerm: string) => {
  const products = await Product.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } },
    ],
  });
  return products;
};

// Update product inventory
export const updateProductInventoryService = async (
  productId: string,
  quantityOrdered: number
) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    return null;
  }

  // Check if sufficient quantity is available
  if (product.inventory.quantity < quantityOrdered) {
    throw new Error('Insufficient quantity available in inventory');
  }

  // Update inventory
  product.inventory.quantity -= quantityOrdered;
  product.inventory.inStock = product.inventory.quantity > 0;

  await product.save();
  return product;
};
