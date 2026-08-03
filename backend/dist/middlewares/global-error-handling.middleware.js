"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const unauthorized_error_1 = __importDefault(require("../domain/errors/unauthorized-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const globalErrorHandlingMiddleware = (err, req, res, next) => {
    console.log({
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        timeStamp: new Date().toISOString(),
    });
    if (err instanceof validation_error_1.default) {
        res.status(400).json({ message: err.message });
        return;
    }
    if (err instanceof not_found_error_1.default) {
        res.status(404).json({ message: err.message });
        return;
    }
    if (err instanceof unauthorized_error_1.default) {
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
        res.status(500).json({ message: "Internal server error" });
    }
    return;
};
exports.default = globalErrorHandlingMiddleware;
