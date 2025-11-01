import { z } from 'zod';

// Variant schema
export const variantValidationSchema = z.object({
  type: z.string().min(1, 'Variant type is required'),
  value: z.string().min(1, 'Variant value is required'),
});

// Inventory schema
export const inventoryValidationSchema = z.object({
  quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
  inStock: z.boolean(),
});

// Product schema
export const productValidationSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Product category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  variants: z.array(variantValidationSchema).min(1, 'At least one variant is required'),
  inventory: inventoryValidationSchema,
});

// Order schema
export const orderValidationSchema = z.object({
  email: z.string().email('Invalid email format'),
  productId: z.string().min(1, 'Product ID is required'),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

// User profile schema
export const profileValidationSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

// User signup schema
export const signupValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'admin']).optional().default('customer'),
  profile: profileValidationSchema.optional(),
});

// User login schema
export const loginValidationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Update profile schema
export const updateProfileValidationSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  profile: profileValidationSchema.optional(),
});

// Change password schema
export const changePasswordValidationSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export type TVariant = z.infer<typeof variantValidationSchema>;
export type TInventory = z.infer<typeof inventoryValidationSchema>;
export type TProduct = z.infer<typeof productValidationSchema>;
export type TOrder = z.infer<typeof orderValidationSchema>;
export type TSignup = z.infer<typeof signupValidationSchema>;
export type TLogin = z.infer<typeof loginValidationSchema>;
export type TUpdateProfile = z.infer<typeof updateProfileValidationSchema>;
export type TChangePassword = z.infer<typeof changePasswordValidationSchema>;
