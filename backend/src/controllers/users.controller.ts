import { 
    getAllUsers,
    getUserById,
    CreateUser,
    UpdateUser,
    loginUser,
    DeleteUser
 } from "../services/users.service";
 import { revokeAllForUser } from "../repositories/refresh_tokens.repository";
 import { findUserById } from "../repositories/users.repository";
 import { rotateRefreshToken,requestPasswordReset,resetPassword } from "../services/users.service";
 import e, { Request,Response,NextFunction } from "express";
 import ValidationError from "../domain/errors/validation-error";
 import UnauthorizedError from "../domain/errors/unauthorized-error";
 import NotFoundError from "../domain/errors/not-found-error";
 import * as jwt from "jsonwebtoken";
import { updateProfilePicture } from "../services/users.service";
import {prisma} from "../db/prisma"


 
 const LoginUser = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const {user,accessToken,refreshToken} = await loginUser(req.body)

        res.cookie("access-Token",accessToken,{

            maxAge: 10 * 60 * 1000,
            httpOnly:true,
            sameSite:"lax",
        });

        res.cookie("refresh-Token", refreshToken,{
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true,
            sameSite: "lax",
        });


        res.json(user);

    }catch(error){
        next(error)
    }

 };

 const RefreshUser = async (req:Request, res:Response, next:NextFunction) => {


    try{

        const oldRefreshToken = req.cookies["refresh-Token"];
        if(!oldRefreshToken){
            throw new UnauthorizedError("No refresh token provided");
        }

        const {newRefreshToken, user_id} = await rotateRefreshToken(oldRefreshToken)

        const user = await findUserById(user_id);

        console.log("user",user);

        const accessToken = jwt.sign(
                {user_id:user.user_id, user_name:user.user_name, user_email: user.user_email,},
                process.env.JWT_SECRET as string,
                { expiresIn: "5m" }
            )

        res.cookie("access-Token", accessToken, {
            maxAge: 2 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
        });

        res.cookie("refresh-Token", newRefreshToken,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(200).json({message: "Token refreshed successfully"})

    }catch(error){
        next(error)
    }

}

 const Register = async (req:Request, res:Response, next:NextFunction) => {

    try{
        const user = await CreateUser(req.body);
        res.status(201).json(`User registered successfully`)

    }catch(error){
        next(error)
    }

 };

 const GetAllUsers = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const users = await getAllUsers();
        res.status(200).json(users)

    }catch(error){

        next(error)

    }

 };

 const GetUserById = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const user_id = Number(req.params.id)
        if(isNaN(user_id))

        return new ValidationError("please enter a valid input")

        const user = await getUserById(user_id)
        res.status(200).json(user)


    }catch(error){

        next(error)

    }
 }

 const UpdateUserById =async (req:Request, res:Response, next:NextFunction) => {

    try{

        const user_id = Number(req.params.id);
        if(isNaN(user_id))
        return new ValidationError("please enter a valid input")

        const user = await UpdateUser(user_id,req.body)
        res.status(200).json(user) 

    }catch(error){
        next(error)

    }

 };

 const DeleteUserById = async (req:Request,res:Response,next:NextFunction) => {

    try{

        const user_id = Number(req.params.id);
        if(isNaN(user_id))
        return new ValidationError("please enter a valid input")
        
        await DeleteUser(user_id)
        res.status(200).json("user deleted successfully") 


    }catch(error){
        next(error)
    }

 }

 const LogoutUser = async(req:Request, res: Response, next: NextFunction) => {

    try{

        const user_id = req.user?.user_id;

        if (user_id) {
            await revokeAllForUser(user_id);
        }

        res.clearCookie("access-Token")
        res.clearCookie("refresh-Token")
        res.status(200).json({message: "User logged out successfully"})

    }catch(error){
        next(error);
    }

};

const RequestPasswordReset = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const {user_email} = req.body;
        const result = await requestPasswordReset(user_email)

        if(result){
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${result.rawToken}`

            console.log(resetLink);
        }
        res.status(200).json({ message: "reset link has been sent." });


    }catch(error){
        next(error)
    }
};

const ResetPassword = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const {token,newPassword} = req.body;
        await resetPassword(token,newPassword);
        res.status(200).json({ message: "Password reset successful" });

    }catch(error){
        next(error)
    }

}


const GetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: req.user.user_id },
        });

        if (!user) throw new NotFoundError("User not found");

        const { user_password, ...safeUser } = user;
        res.status(200).json({ user: safeUser });
    } catch (error) {
        next(error);
    }
};


const UpdateProfilePictureController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new ValidationError("No file uploaded");
        }

        const filePath = `/uploads/profile-pictures/${req.file.filename}`;
        const user = await updateProfilePicture(req.user.user_id, filePath);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export {
    LoginUser,
    Register,
    GetAllUsers,
    GetUserById,
    UpdateUserById,
    DeleteUserById,
    LogoutUser,
    RefreshUser,
    GetUser,
    RequestPasswordReset,
    ResetPassword,
    UpdateProfilePictureController
}
