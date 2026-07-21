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

import express from "express";
import { validateToken } from "../middlewares/JWT.middleware";


const UserRouter = express.Router();

UserRouter
      .route("/")
      .get(GetAllUsers)


    UserRouter
      .route("/register")
      .post(Register)
      
    UserRouter
      .route("/login")
      .post(LoginUser)

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
      .post(RequestPasswordReset)

    UserRouter
      .route("/password_reset/confirm")
      .post(ResetPassword)

    


      export default UserRouter;
    