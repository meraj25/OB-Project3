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
exports.resetPassword = exports.requestPasswordReset = exports.rotateRefreshToken = exports.issueRefreshToken = exports.DeleteUser = exports.UpdateUser = exports.loginUser = exports.CreateUser = exports.getUserById = exports.getAllUsers = void 0;
const users_repository_1 = require("../repositories/users.repository");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const unauthorized_error_1 = __importDefault(require("../domain/errors/unauthorized-error"));
const refresh_tokens_repository_1 = require("../repositories/refresh_tokens.repository");
const reset_password_token_repository_1 = require("../repositories/reset_password_token.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
const getAllUsers = async () => {
    const users = await (0, users_repository_1.findAllUsers)();
    return users.map(({ user_password, ...safeuser }) => safeuser);
};
exports.getAllUsers = getAllUsers;
const getUserById = async (user_id) => {
    const user = await (0, users_repository_1.findUserById)(user_id);
    if (!user) {
        throw new validation_error_1.default("Not found!");
    }
    const { user_password, ...safeUser } = user;
    return safeUser;
};
exports.getUserById = getUserById;
const CreateUser = async (data) => {
    if (!data.user_password) {
        throw new validation_error_1.default("Required credentials");
    }
    const user_email = await (0, users_repository_1.findUserByEmail)(data.user_email);
    if (user_email) {
        throw { status: 409, message: "User has already registered, try a new one!" };
    }
    const hashedPassword = await bcrypt_1.default.hash(data.user_password, 10);
    const user = await (0, users_repository_1.createUser)({ user_name: data.user_name, user_email: data.user_email, user_password: hashedPassword });
    const { user_password, ...safeUser } = user;
    return safeUser;
};
exports.CreateUser = CreateUser;
const loginUser = async (data) => {
    if (!data.user_email || !data.user_password) {
        throw new validation_error_1.default("Require credentials");
    }
    const user = await (0, users_repository_1.findUserByEmail)(data.user_email);
    if (!data.user_email) {
        throw new not_found_error_1.default("Not found error!");
    }
    let matchingUser = null;
    if (!user.user_password) {
        throw new validation_error_1.default("Invalid credentials");
    }
    const ismatch = await bcrypt_1.default.compare(data.user_password, user.user_password);
    if (ismatch) {
        matchingUser = user;
    }
    if (!matchingUser) {
        throw new validation_error_1.default("Invalid credentials");
    }
    const accessToken = jwt.sign({ user_id: matchingUser.user_id, user_email: matchingUser.user_email }, process.env.JWT_SECRET, { expiresIn: "5m" });
    const refreshToken = await issueRefreshToken(matchingUser.user_id);
    const { user_password, ...safeUser } = matchingUser;
    return { user: safeUser, accessToken, refreshToken };
};
exports.loginUser = loginUser;
const UpdateUser = async (user_id, data) => {
    if (data.user_password) {
        data.user_password = await bcrypt_1.default.hash(data.user_password, 10);
    }
    try {
        const user = await (0, users_repository_1.updateUser)(user_id, data);
        const { user_password, ...safeUser } = user;
        return safeUser;
    }
    catch (error) {
        throw new not_found_error_1.default("Not found");
    }
};
exports.UpdateUser = UpdateUser;
const DeleteUser = async (user_id) => {
    if (!user_id) {
        throw new not_found_error_1.default("user not found!");
    }
    await (0, users_repository_1.deleteUser)(user_id);
};
exports.DeleteUser = DeleteUser;
const issueRefreshToken = async (user_id) => {
    const rawToken = crypto_1.default.randomBytes(32).toString('hex');
    const tokenHash = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await (0, refresh_tokens_repository_1.createToken)(user_id, tokenHash, expiresAt);
    return rawToken;
};
exports.issueRefreshToken = issueRefreshToken;
const rotateRefreshToken = async (rawToken) => {
    const tokenHash = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
    const existing = await (0, refresh_tokens_repository_1.findByHash)(tokenHash);
    if (!existing || existing.revoked || existing.expires_at < new Date()) {
        throw new unauthorized_error_1.default('Invalid or expired refresh token');
    }
    await (0, refresh_tokens_repository_1.revoke)(existing.token_id);
    const newRefreshToken = await issueRefreshToken(existing.user_id);
    return { newRefreshToken, user_id: existing.user_id };
};
exports.rotateRefreshToken = rotateRefreshToken;
const requestPasswordReset = async (user_email) => {
    if (!user_email) {
        throw new validation_error_1.default("Required credentials");
    }
    const user = await (0, users_repository_1.findUserByEmail)(user_email);
    if (!user)
        return null;
    await (0, reset_password_token_repository_1.invallidateForAllUser)(user.user_id);
    const rawToken = crypto_1.default.randomBytes(32).toString('hex');
    const tokenHash = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    await (0, reset_password_token_repository_1.createToken)(user.user_id, tokenHash, expiresAt);
    return { rawToken, user_id: user.user_id, email: user.user_email };
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (rawToken, newPassword) => {
    console.log(rawToken, newPassword);
    if (!rawToken || !newPassword) {
        throw new validation_error_1.default("Required credentials");
    }
    const tokenHash = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
    const existing = await (0, reset_password_token_repository_1.findByHash)(tokenHash);
    if (!existing || existing.used || existing.expires_at < new Date()) {
        throw new unauthorized_error_1.default("Invalid or expired reset token");
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await (0, users_repository_1.updateUser)(existing.user_id, { user_password: hashedPassword });
    await (0, refresh_tokens_repository_1.revokeAllForUser)(existing.user_id);
    return { user_id: existing.user_id };
};
exports.resetPassword = resetPassword;
