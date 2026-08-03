"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("../controllers/users.controller");
const express_1 = __importDefault(require("express"));
const JWT_middleware_1 = require("../middlewares/JWT.middleware");
const rateLimiters_middleware_1 = require("../middlewares/rateLimiters.middleware");
const UserRouter = express_1.default.Router();
UserRouter
    .route("/")
    .get(users_controller_1.GetAllUsers);
UserRouter
    .route("/register")
    .post(users_controller_1.Register);
UserRouter
    .route("/login")
    .post(rateLimiters_middleware_1.loginLimiter, users_controller_1.LoginUser);
UserRouter
    .route("/refresh")
    .post(users_controller_1.RefreshUser);
UserRouter
    .route("/logout")
    .post(JWT_middleware_1.validateToken, users_controller_1.LogoutUser);
UserRouter
    .route("/getuser")
    .get(JWT_middleware_1.validateToken, users_controller_1.GetUser);
UserRouter
    .route("/:id")
    .get(JWT_middleware_1.validateToken, users_controller_1.GetUserById)
    .patch(JWT_middleware_1.validateToken, users_controller_1.UpdateUserById)
    .delete(JWT_middleware_1.validateToken, users_controller_1.DeleteUserById);
UserRouter
    .route("/password_reset/request")
    .post(rateLimiters_middleware_1.passwordResetLimiter, users_controller_1.RequestPasswordReset);
UserRouter
    .route("/password_reset/confirm")
    .post(users_controller_1.ResetPassword);
exports.default = UserRouter;
