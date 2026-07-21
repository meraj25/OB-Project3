import * as jwt from "jsonwebtoken"
import {Request,Response,NextFunction} from "express"



const validateToken = (req:Request, res:Response, next:NextFunction) => {

    const accessToken = req.cookies["access-Token"]

    if(!accessToken){
        return res.status(401).json({message: "User not authenticated"});
    }

    try{

        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET as string) as { user_id: number; user_email: string;  }

        req.user = decoded
        return next();
    }catch(error){
        return res.status(403).json({message: "Invalid token"});
    }

}
export {validateToken}