"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMember = exports.updateMember = exports.createMember = exports.getAllWorkspaceMembers = void 0;
const workspace_members_1 = require("../repositories/workspace_members");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const prisma_1 = require("../db/prisma");
const getAllWorkspaceMembers = async (workspace_id) => {
    return prisma_1.prisma.workspace_members.findMany({
        where: { workspace_id }
    });
};
exports.getAllWorkspaceMembers = getAllWorkspaceMembers;
const createMember = async (data) => {
    if (!data.user_id || !data.role_id) {
        throw new validation_error_1.default("Email and role are required");
    }
    if (data.role_id === 1) {
        throw new validation_error_1.default("Cannot assign owner role directly");
    }
    const existing = await (0, workspace_members_1.findMembership)(data.user_id, data.workspace_id);
    if (existing) {
        throw { status: 409, message: "User is already a member of this workspace" };
    }
    return (0, workspace_members_1.createWorkspaceMember)({ workspace_id: data.workspace_id, user_id: data.user_id, role_id: data.role_id });
};
exports.createMember = createMember;
const updateMember = async (workspace_member_id, workspace_id, role_id) => {
    if (!role_id) {
        throw new validation_error_1.default("Role is required");
    }
    const member = await (0, workspace_members_1.findWorkspaceMember)(workspace_member_id);
    if (!member || member.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("Member not found");
    }
    if (member.role_id === 1 || role_id === 1) {
        throw new validation_error_1.default("Cannot change ownership or assign an ownership");
    }
    return (0, workspace_members_1.updateWorkspaceMember)(workspace_member_id, { role_id });
};
exports.updateMember = updateMember;
const deleteMember = async (workspace_member_id, workspace_id) => {
    const member = await (0, workspace_members_1.findWorkspaceMember)(workspace_member_id);
    if (!member || member.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("Member not found");
    }
    if (member.role_id === 1) {
        throw new validation_error_1.default("Cannot remove the workspace owner");
    }
    return (0, workspace_members_1.deleteWorkspaceMember)(workspace_member_id);
};
exports.deleteMember = deleteMember;
