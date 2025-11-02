import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'E-commerce API with Authentication is running successfully!',
  });
});

// Handle not found routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err: unknown, req: Request, res: Response, _next: unknown) => {
  // Mark _next as used to satisfy lint
  void _next;
  // Better typing for error handling
  console.error((err as Error)?.stack || err);
  const message = (err as Error)?.message || 'Internal server error';
  res.status(500).json({
    success: false,
    message,
  });
});

export default app;
