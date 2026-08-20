import { 
    findAllUsers,
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    deleteUser} from "../repositories/users.repository";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";
import ForbiddenError from "../domain/errors/forbidden-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import { createToken ,findByHash,revoke,revokeAllForUser } from "../repositories/refresh_tokens.repository";
import { 
    createToken as createResetToken,
    findByHash as findResetByHash,
    markUsed,
    invallidateForAllUser } from "../repositories/reset_password_token.repository";
import bcrypt from "bcrypt"
import crypto from "crypto"
import * as jwt from "jsonwebtoken"
import {prisma} from "../db/prisma"
import { sendVerificationEmail } from "../utils/mail";

const getAllUsers  = async () => {

    const users = await findAllUsers();
    return users.map(({ user_password, ...safeuser}) => safeuser)
};

const getUserById = async (user_id:number) => {

    const user = await findUserById(user_id)
    if(!user){
        throw new ValidationError("Not found!");
    }

    const {user_password, ...safeUser} = user;
    return safeUser; 

};



const CreateUser = async (data:{user_name?:string,user_email:string,user_password:string}) => {

    if(!data.user_password){
        throw new ValidationError("Required credentials");
    }


    const user_email = await findUserByEmail(data.user_email)

       if(user_email){
        throw { status: 409, message: "User has already registered, try a new one!" };
    }

    const hashedPassword = await bcrypt.hash(data.user_password, 10);
    const user = await createUser({user_name: data.user_name, user_email: data.user_email,user_password:hashedPassword})

    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    await prisma.verification_tokens.create({
        data: { user_id: user.user_id, token, expires_at },
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await sendVerificationEmail(user.user_email, verifyLink);

    const {user_password, ...safeUser} = user;
    return safeUser;


}


const loginUser = async (data:{user_email:string;user_password:string}) => {

    if(!data.user_email || !data.user_password){
         throw new ValidationError("Require credentials")
    }

    const user = await findUserByEmail(data.user_email)
    if(!user){
        throw new NotFoundError("Not found error!")
    }

    if (!user.email_verified) {
        throw new ValidationError("Please verify your email before logging in");
    }

    if (!user.user_password) {
        throw new ValidationError("This account uses Google sign-in. Please log in with Google.");
    }

    let matchingUser = null;

    if(!user.user_password){
        throw new ValidationError ("Invalid credentials")
    }

    const ismatch = await bcrypt.compare(data.user_password, user.user_password)
    if(ismatch){
        matchingUser = user;
    }

    if (!matchingUser) {
    throw new ValidationError ("Invalid credentials")
    }

    if (!matchingUser.user_password) {
    throw new ValidationError("This account uses Google sign-in. Please log in with Google.");
    }

    const accessToken = jwt.sign(
        {user_id:matchingUser.user_id, user_name:matchingUser.user_name, user_email: matchingUser.user_email },
        process.env.JWT_SECRET as string,
        { expiresIn: "5m" }
    )

    const refreshToken = await issueRefreshToken(matchingUser.user_id)


    const {user_password, ...safeUser} = matchingUser;
    return{user:safeUser,accessToken,refreshToken};

}

const UpdateUser = async (user_id: number , data: Partial<{user_name: string , user_password:string}>) => {

    if(data.user_password){
        data.user_password = await bcrypt.hash(data.user_password,10)
    }

    try{
        const user = await updateUser(user_id,data);    
        const { user_password, ...safeUser} = user;
        return safeUser;

    }catch(error){
        throw new NotFoundError("Not found")
    }

};

const DeleteUser = async (user_id:number) => {

    if(!user_id){
        throw new NotFoundError("user not found!")  
    }

    await deleteUser(user_id);

};

const issueRefreshToken = async (user_id:number) => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await createToken(user_id,tokenHash,expiresAt);
    return rawToken;
};

const rotateRefreshToken = async (rawToken:string) => {

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const existing = await findByHash(tokenHash);

    if(!existing || existing.revoked || existing.expires_at < new Date()){
        throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await revoke(existing.token_id)

    const newRefreshToken = await issueRefreshToken(existing.user_id); 

    return {newRefreshToken, user_id: existing.user_id}

};

const requestPasswordReset = async (user_email:string) => {

    if(!user_email){
        throw new ValidationError("Required credentials");
    }

    const user = await findUserByEmail(user_email);

    if(!user)
        return null;

    await invallidateForAllUser(user.user_id)

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await createResetToken(user.user_id,tokenHash,expiresAt)

    return {rawToken, user_id: user.user_id, email:user.user_email}

};

const resetPassword = async (rawToken:string, newPassword:string) => {

    console.log(rawToken,newPassword);

    if(!rawToken || !newPassword){
        throw new ValidationError("Required credentials");
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const existing = await findResetByHash(tokenHash);

    if (!existing || existing.used || existing.expires_at < new Date()) {
        throw new UnauthorizedError("Invalid or expired reset token");
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await updateUser(existing.user_id,{user_password:hashedPassword});

    await revokeAllForUser(existing.user_id);

    return { user_id: existing.user_id}

}

const updateProfilePicture = async (user_id: number, filePath: string) => {
    const user = await prisma.users.update({
        where: { user_id },
        data: { profile_picture: filePath },
    });

    const { user_password, ...safeUser } = user;
    return safeUser;
};

export {
    getAllUsers,
    getUserById,
    CreateUser,
    loginUser,
    UpdateUser,
    DeleteUser,
    issueRefreshToken,
    rotateRefreshToken,
    requestPasswordReset,
    resetPassword,
    updateProfilePicture


}