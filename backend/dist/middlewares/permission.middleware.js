"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPermissions = void 0;
const workspace_members_1 = require("../repositories/workspace_members");
const permissions_1 = require("../domain/permissions");
const attachPermissions = async (req, res, next) => {
    const user_id = req.user?.user_id;
    const workspace_id = Number(req.params.workspace_id);
    if (!user_id)
        return res.status(401).json({ error: "Not authenticated" });
    if (isNaN(workspace_id))
        return res.status(404).json({ error: "Not found" });
    const membership = await (0, workspace_members_1.findMembership)(user_id, workspace_id);
    if (!membership)
        return res.status(404).json({ error: "Not found" });
    const allowedActions = permissions_1.permissions[membership?.role_id] ?? [];
    req.membership = membership;
    req.allowedActions = allowedActions;
    next();
};
exports.attachPermissions = attachPermissions;
