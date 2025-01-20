import UserModel from "../models/userModel.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import asyncHandler from "../utils/asyncHandler.js";

export default class UserServices {
    constructor() {
        this.userModel = new UserModel();
    }

    async registerUser(userData) {
        try {
            if (!userData.email || !userData.password || !userData.user_role) {
                return new ApiResponse(400, null, "Missing required fields");
            }

            const user = await this.userModel.createUser(userData);
            if (user.statusCode !== 201) {
                return user;
            }

            const authToken = user.data.generateAccessToken();
            const refreshToken = user.data.generateRefreshToken();
            
            const tokenUpdate = await this.userModel.updateTokens(
                user.data._id, 
                authToken, 
                refreshToken
            );

            if (tokenUpdate.statusCode !== 200) {
                return tokenUpdate;
            }

            return new ApiResponse(201, {
                user: user.data,
                authToken,
                refreshToken
            }, "Registration successful");
        } catch (error) {
            return new ApiResponse(500, null, "Registration failed");
        }
    }

    async loginUser(credentials) {
        try {
            const { email, password } = credentials;
            
            if (!email || !password) {
                return new ApiResponse(400, null, "Email and password required");
            }

            const user = await this.userModel.findUserByEmail(email);
            if (user.statusCode !== 200) {
                return new ApiResponse(401, null, "Invalid credentials");
            }

            const isPasswordValid = await user.data.comparePasswords(password);
            if (!isPasswordValid) {
                return new ApiResponse(401, null, "Invalid credentials");
            }

            const authToken = user.data.generateAccessToken();
            const refreshToken = user.data.generateRefreshToken();

            const tokenUpdate = await this.userModel.updateTokens(
                user.data._id, 
                authToken, 
                refreshToken
            );

            if (tokenUpdate.statusCode !== 200) {
                return tokenUpdate;
            }

            user.data.password = undefined;

            return new ApiResponse(200, {
                user: user.data,
                authToken,
                refreshToken
            }, "Login successful");
        } catch (error) {
            return new ApiResponse(500, null, "Login failed");
        }
    }

    async refreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                return new ApiResponse(401, null, "Refresh token is required");
            }

            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await this.userModel.findUserById(decoded._id);

            if (user.statusCode !== 200 || user.data.refreshToken !== refreshToken) {
                return new ApiResponse(401, null, "Invalid refresh token");
            }

            const newAuthToken = user.data.generateAccessToken();
            const newRefreshToken = user.data.generateRefreshToken();
            await this.userModel.updateTokens(user.data._id, newAuthToken, newRefreshToken);

            return new ApiResponse(200, {
                authToken: newAuthToken,
                refreshToken: newRefreshToken
            }, "Tokens refreshed successfully");
        } catch (error) {
            return new ApiResponse(401, null, "Invalid refresh token");
        }
    }

    async logoutUser(userId) {
        try {
            return await this.userModel.clearTokens(userId);
        } catch (error) {
            return new ApiResponse(500, null, error.message);
        }
    }

    async getCurrentUser(userId) {
        try {
            return await this.userModel.findUserById(userId);
        } catch (error) {
            return new ApiResponse(500, null, error.message);
        }
    }

    async forgotPassword(email) {
        try {
            const user = await this.userModel.findUserByEmail(email);
            if (user.statusCode !== 200) {
                return new ApiResponse(404, null, "User not found");
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

            await this.userModel.updateUser(user.data._id, {
                resetPasswordToken: resetToken,
                resetPasswordExpiry: resetTokenExpiry
            });

            return new ApiResponse(200, { resetToken }, "Password reset token generated");
        } catch (error) {
            return new ApiResponse(500, null, error.message);
        }
    }

    async resetPassword(resetToken, newPassword) {
        try {
            const user = await this.userModel.findOne({
                resetPasswordToken: resetToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });

            if (!user) {
                return new ApiResponse(400, null, "Invalid or expired reset token");
            }

            const result = await this.userModel.updatePassword(user._id, newPassword);
            if (result.statusCode === 200) {
                await this.userModel.updateUser(user._id, {
                    resetPasswordToken: undefined,
                    resetPasswordExpiry: undefined
                });
            }

            return result;
        } catch (error) {
            return new ApiResponse(500, null, error.message);
        }
    }

    async updateProfile(userId, updateData) {
        try {
            return await this.userModel.updateUser(userId, updateData);
        } catch (error) {
            return new ApiResponse(500, null, error.message);
        }
    }

    async verifyEmail(userId) {
        try {
            return await this.userModel.verifyEmail(userId);
        } catch (error) {
            return new ApiResponse(500, null, error.message);
        }
    }

    demoteAdmin = asyncHandler(async (userId) => {
        return await this.userModel.demoteAdmin(userId);
    });

    promoteAdmin = asyncHandler(async (userId, userRoleAsAdmin) => {
        return await this.userModel.promoteAdmin(userId, userRoleAsAdmin);
    });

    verifyandLockUser = asyncHandler(async (userId) => {
        return await this.userModel.verifyandLockUser(userId);
    });

    unlockUserProfile = asyncHandler(async (userId, adminId) => {
        return await this.userModel.unlockUserProfile(userId, adminId);
    })

    deleteUser = asyncHandler(async(userId)=>{
        return await this.userModel.deleteUser(userId);
    })
}