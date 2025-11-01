import { Order, IOrder } from '../models/order.model';
import { Product } from '../models/product.model';

// Create a new order
export const createOrderService = async (orderData: any): Promise<IOrder> => {
  // Validate and calculate total
  let totalAmount = 0;
  const items = [];

  for (const item of orderData.items) {
    const product = await Product.findById(item.productId);
    
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    if (!product.inventory.inStock || product.inventory.quantity < item.quantity) {
      throw new Error(`${product.name} is out of stock or insufficient quantity`);
    }

    // Add item with current product data
    items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    });

    totalAmount += product.price * item.quantity;

    // Update product inventory
    product.inventory.quantity -= item.quantity;
    if (product.inventory.quantity === 0) {
      product.inventory.inStock = false;
    }
    await product.save();
  }

  // Create order
  const order = await Order.create({
    ...orderData,
    items,
    totalAmount,
  });

  return order;
};

// Get all orders for a user
export const getUserOrdersService = async (userId: string): Promise<IOrder[]> => {
  const orders = await Order.find({ userId })
    .populate('items.productId')
    .sort({ createdAt: -1 });
  
  return orders;
};

// Get all orders (admin)
export const getAllOrdersService = async (): Promise<IOrder[]> => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .populate('items.productId')
    .sort({ createdAt: -1 });
  
  return orders;
};

// Get order by ID
export const getOrderByIdService = async (orderId: string): Promise<IOrder | null> => {
  const order = await Order.findById(orderId)
    .populate('userId', 'name email')
    .populate('items.productId');
  
  return order;
};

// Update order status (admin)
export const updateOrderStatusService = async (
  orderId: string,
  status: string
): Promise<IOrder | null> => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  );

  return order;
};

// Cancel order
export const cancelOrderService = async (orderId: string, userId: string): Promise<IOrder | null> => {
  const order = await Order.findOne({ _id: orderId, userId });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'pending') {
    throw new Error('Only pending orders can be cancelled');
  }

  // Restore product inventory
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.inventory.quantity += item.quantity;
      product.inventory.inStock = true;
      await product.save();
    }
  }

  order.status = 'cancelled';
  await order.save();

  return order;
};

