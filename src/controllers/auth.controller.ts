import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

// Helper to safely extract error messages from unknown errors
const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));
import {
  registerUserService,
  loginUserService,
  getUserProfileService,
  updateUserProfileService,
  changePasswordService,
  getAllUsersService,
  deleteUserService,
} from '../services/auth.service';
import {
  signupValidationSchema,
  loginValidationSchema,
  updateProfileValidationSchema,
  changePasswordValidationSchema,
} from '../validators/validation';

// Register new user
export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = signupValidationSchema.parse(req.body);

    // Register user
    const { user, token } = await registerUserService(validatedData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: {
        user,
        token,
      },
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to register user',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginValidationSchema.parse(req.body);

    // Login user
    const { user, token } = await loginUserService(validatedData);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user,
        token,
      },
    });
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: getErrorMessage(error) || 'Login failed',
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userFromReq = (req as Request & { user?: { userId?: string; _id?: string } }).user;
    const userId = userFromReq?.userId || userFromReq?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await getUserProfileService(userId as string);

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully!',
      data: user,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to fetch profile',
    });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = updateProfileValidationSchema.parse(req.body);

    // Update profile
    const userFromReq = (req as Request & { user?: { userId?: string; _id?: string } }).user;
    const userId = userFromReq?.userId || userFromReq?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await updateUserProfileService(userId as string, validatedData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: user,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to update profile',
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = changePasswordValidationSchema.parse(req.body);

    // Change password
    const userFromReq = (req as Request & { user?: { userId?: string; _id?: string } }).user;
    const userId = userFromReq?.userId || userFromReq?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await changePasswordService(userId as string, validatedData);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to change password',
    });
  }
};

// Logout (client-side should remove token)
export const logout = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully!',
  });
};

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: users,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to fetch users',
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await deleteUserService(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: null,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to delete user',
    });
  }
};

// Create admin user (⚠️ DEVELOPMENT ONLY - Remove in production!)
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await getAllUsersService();
    const userExists = existingUser.some((user) => user.email === email);
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create admin user directly (bypassing registerUserService to set role)
    const { User } = await import('../models/user.model');
    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    // Generate token
    const token = jwt.sign(
      { id: adminUser._id, email: adminUser.email, role: adminUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpire as jwt.SignOptions['expiresIn'] }
    );

    // Remove password from response - use JSON trick to get a plain object
    const userObject = JSON.parse(JSON.stringify(adminUser));
    delete (userObject as Record<string, unknown>).password;

    res.status(201).json({
      success: true,
      message: '🎉 Admin user created successfully! ⚠️ Remember to remove this endpoint in production!',
      data: {
        user: userObject,
        token,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error) || 'Failed to create admin',
    });
  }
};
