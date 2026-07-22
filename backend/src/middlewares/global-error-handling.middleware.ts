import { Request,Response,NextFunction } from "express";
import ValidationError from "../domain/errors/validation-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import ForbiddenError from "../domain/errors/forbidden-error";
import NotFoundError from "../domain/errors/not-found-error";


const globalErrorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log({
    name:err.name,
    message:err.message,
    stack:err.stack,
    path:req.originalUrl,
    method:req.method,
    timeStamp:new Date(). toISOString(),
  });

  
  if (err instanceof ValidationError) {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: err.message });
    return;
  }

  /*if(err instanceof ZodError){
    res.status(400).json({
      message:"validation failed",
      errors: err.issues.map((i) =>({
        path: i.path.join("."),
        message:i.message,
      })),
    });
    return
  }*/
   else {
    
    res.status(500).json({ message: "Internal server error"});
  }
  return;

};

export default globalErrorHandlingMiddleware;