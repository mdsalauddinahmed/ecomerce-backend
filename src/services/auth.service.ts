import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { config } from '../config/config';
import { TSignup, TLogin, TUpdateProfile, TChangePassword } from '../validators/validation';

// Generate JWT Token
const generateToken = (userId: string, email: string, role: string): string => {
  const options: jwt.SignOptions = {
    // cast to the SignOptions['expiresIn'] type to satisfy TS typings
    expiresIn: config.jwtExpire as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId, email, role }, config.jwtSecret, options);
};

// Register new user
export const registerUserService = async (userData: TSignup) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create(userData);

  // Generate token
  const token = generateToken(String(user._id), user.email, user.role);

  // Remove password from response - convert to plain object safely
  const userObject = JSON.parse(JSON.stringify(user));
  delete (userObject as Record<string, unknown>).password;

  return { user: userObject, token };
};

// Login user
export const loginUserService = async (credentials: TLogin) => {
  // Find user by email and include password
  const user = await User.findOne({ email: credentials.email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(credentials.password);

  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(String(user._id), user.email, user.role);

  // Remove password from response - convert to plain object safely
  const userObject = JSON.parse(JSON.stringify(user));
  delete (userObject as Record<string, unknown>).password;

  return { user: userObject, token };
};

// Get user profile
export const getUserProfileService = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

// Update user profile
export const updateUserProfileService = async (
  userId: string,
  updateData: TUpdateProfile
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Change password
export const changePasswordService = async (
  userId: string,
  passwordData: TChangePassword
) => {
  // Get user with password
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordCorrect = await user.comparePassword(passwordData.currentPassword);

  if (!isPasswordCorrect) {
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = passwordData.newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

// Get all users (admin only)
export const getAllUsersService = async () => {
  const users = await User.find().select('-password');
  return users;
};

// Delete user (admin only)
export const deleteUserService = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
