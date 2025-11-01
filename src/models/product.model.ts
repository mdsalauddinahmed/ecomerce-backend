import mongoose, { Schema, Document } from 'mongoose';

// Interface for Variant
interface IVariant {
  type: string;
  value: string;
}

// Interface for Inventory
interface IInventory {
  quantity: number;
  inStock: boolean;
}

// Interface for Product Document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  variants: IVariant[];
  inventory: IInventory;
  categoryData?: any; // Category-specific fields (size, color, weight, etc.)
  image?: string; // Cloudinary image URL
}

// Variant Schema
const variantSchema = new Schema<IVariant>(
  {
    type: {
      type: String,
      required: [true, 'Variant type is required'],
    },
    value: {
      type: String,
      required: [true, 'Variant value is required'],
    },
  },
  { _id: false }
);

// Inventory Schema
const inventorySchema = new Schema<IInventory>(
  {
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    inStock: {
      type: Boolean,
      required: [true, 'InStock status is required'],
    },
  },
  { _id: false }
);

// Product Schema
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    tags: {
      type: [String],
      required: [true, 'At least one tag is required'],
    },
    variants: {
      type: [variantSchema],
      required: [true, 'At least one variant is required'],
    },
    inventory: {
      type: inventorySchema,
      required: [true, 'Inventory information is required'],
    },
    categoryData: {
      type: Schema.Types.Mixed,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create and export the Product model
export const Product = mongoose.model<IProduct>('Product', productSchema);
