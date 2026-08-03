"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAction = void 0;
const requireAction = (action) => {
    return (req, res, next) => {
        if (!req.allowedActions?.includes(action)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        next();
    };
};
exports.requireAction = requireAction;
