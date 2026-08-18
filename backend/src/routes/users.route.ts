import { 
    LoginUser,
    Register,
    GetAllUsers,
    GetUserById,
    UpdateUserById,
    DeleteUserById,
    LogoutUser,
    RefreshUser,
    RequestPasswordReset,
    ResetPassword,
    GetUser } from "../controllers/users.controller";
  import VerifyEmailController from "../controllers/verify_email.controller";

import express from "express";
import { validateToken } from "../middlewares/JWT.middleware";
import {loginLimiter,passwordResetLimiter} from "../middlewares/rateLimiters.middleware"


const UserRouter = express.Router();

UserRouter
      .route("/")
      .get(GetAllUsers)


    UserRouter
      .route("/register")
      .post(Register)
      
    UserRouter
      .route("/login")
      .post(loginLimiter,LoginUser)

     UserRouter
      .route("/refresh")
      .post(RefreshUser)

    UserRouter
      .route("/logout")
      .post(validateToken,LogoutUser)

    UserRouter
      .route("/getuser")
      .get(validateToken,GetUser)


    UserRouter
      .route("/:id")
      .get(validateToken,GetUserById)
      .patch(validateToken,UpdateUserById)
      .delete(validateToken,DeleteUserById)

    UserRouter
      .route("/password_reset/request")
      .post(passwordResetLimiter,RequestPasswordReset)

    UserRouter
      .route("/password_reset/confirm")
      .post(ResetPassword)

    UserRouter
      .route("/verify-email/:token")
      .get(VerifyEmailController)

    


      export default UserRouter;
    