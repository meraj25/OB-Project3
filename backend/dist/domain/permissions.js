"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = exports.permissions = void 0;
const permissions = {
    1: ["workspace:update", "workspace:delete", "member:invite", "member:remove", "member:changeRole", "project:create", "project:update", "project:delete", "issue:create", "issue:update", "issue:delete"],
    2: ["project:create", "project:update", "project:delete", "issue:create", "issue:update", "issue:delete"],
    3: ["issue:update"],
};
exports.permissions = permissions;
const permission = (role_id, action) => {
    return permissions[role_id]?.includes(action) ?? false;
};
exports.permission = permission;
