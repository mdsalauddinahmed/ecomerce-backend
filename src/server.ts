import app from './app';
import { config } from './config/config';
import { connectDB } from './config/database';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB(config.mongodbUri);

    // Start the server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
