"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = exports.RequestPasswordReset = exports.GetUser = exports.RefreshUser = exports.LogoutUser = exports.DeleteUserById = exports.UpdateUserById = exports.GetUserById = exports.GetAllUsers = exports.Register = exports.LoginUser = void 0;
const users_service_1 = require("../services/users.service");
const refresh_tokens_repository_1 = require("../repositories/refresh_tokens.repository");
const users_repository_1 = require("../repositories/users.repository");
const users_service_2 = require("../services/users.service");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const unauthorized_error_1 = __importDefault(require("../domain/errors/unauthorized-error"));
const jwt = __importStar(require("jsonwebtoken"));
const LoginUser = async (req, res, next) => {
    try {
        const { user, accessToken, refreshToken } = await (0, users_service_1.loginUser)(req.body);
        res.cookie("access-Token", accessToken, {
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
        });
        res.cookie("refresh-Token", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.LoginUser = LoginUser;
const RefreshUser = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies["refresh-Token"];
        if (!oldRefreshToken) {
            throw new unauthorized_error_1.default("No refresh token provided");
        }
        const { newRefreshToken, user_id } = await (0, users_service_2.rotateRefreshToken)(oldRefreshToken);
        const user = await (0, users_repository_1.findUserById)(user_id);
        console.log("user", user);
        const accessToken = jwt.sign({ user_id: user.user_id, user_email: user.user_email, }, process.env.JWT_SECRET, { expiresIn: "5m" });
        res.cookie("access-Token", accessToken, {
            maxAge: 2 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
        });
        res.cookie("refresh-Token", newRefreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(200).json({ message: "Token refreshed successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.RefreshUser = RefreshUser;
const Register = async (req, res, next) => {
    try {
        const user = await (0, users_service_1.CreateUser)(req.body);
        res.status(201).json(`User registered successfully`);
    }
    catch (error) {
        next(error);
    }
};
exports.Register = Register;
const GetAllUsers = async (req, res, next) => {
    try {
        const users = await (0, users_service_1.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.GetAllUsers = GetAllUsers;
const GetUserById = async (req, res, next) => {
    try {
        const user_id = Number(req.params.id);
        if (isNaN(user_id))
            return new validation_error_1.default("please enter a valid input");
        const user = await (0, users_service_1.getUserById)(user_id);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.GetUserById = GetUserById;
const UpdateUserById = async (req, res, next) => {
    try {
        const user_id = Number(req.params.id);
        if (isNaN(user_id))
            return new validation_error_1.default("please enter a valid input");
        const user = await (0, users_service_1.UpdateUser)(user_id, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.UpdateUserById = UpdateUserById;
const DeleteUserById = async (req, res, next) => {
    try {
        const user_id = Number(req.params.id);
        if (isNaN(user_id))
            return new validation_error_1.default("please enter a valid input");
        await (0, users_service_1.DeleteUser)(user_id);
        res.status(200).json("user deleted successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.DeleteUserById = DeleteUserById;
const LogoutUser = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id;
        if (user_id) {
            await (0, refresh_tokens_repository_1.revokeAllForUser)(user_id);
        }
        res.clearCookie("access-Token");
        res.clearCookie("refresh-Token");
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.LogoutUser = LogoutUser;
const RequestPasswordReset = async (req, res, next) => {
    try {
        const { user_email } = req.body;
        const result = await (0, users_service_2.requestPasswordReset)(user_email);
        if (result) {
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${result.rawToken}`;
            console.log(resetLink);
        }
        res.status(200).json({ message: "reset link has been sent." });
    }
    catch (error) {
        next(error);
    }
};
exports.RequestPasswordReset = RequestPasswordReset;
const ResetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        await (0, users_service_2.resetPassword)(token, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        next(error);
    }
};
exports.ResetPassword = ResetPassword;
const GetUser = async (req, res) => {
    res.status(200).json({ user: req.user });
};
exports.GetUser = GetUser;
