"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateMembership = exports.findByWorkspace = exports.deleteWorkspaceMember = exports.updateWorkspaceMember = exports.findMembership = exports.createWorkspaceMember = exports.findWorkspaceMember = exports.findAllWorkspaceMembers = void 0;
const prisma_1 = require("../db/prisma");
const redisClient_1 = require("../utils/redisClient");
const CACHE_TTL_SECONDS = 30;
const findAllWorkspaceMembers = () => {
    return prisma_1.prisma.workspace_members.findMany();
};
exports.findAllWorkspaceMembers = findAllWorkspaceMembers;
const findWorkspaceMember = (workspace_member_id) => {
    return prisma_1.prisma.workspace_members.findUnique({
        where: { workspace_member_id }
    });
};
exports.findWorkspaceMember = findWorkspaceMember;
const findMembership = async (user_id, workspace_id) => {
    const key = `membership:${user_id}:${workspace_id}`;
    const cached = await redisClient_1.redis.get(key);
    if (cached) {
        return JSON.parse(cached);
    }
    const membership = await prisma_1.prisma.workspace_members.findUnique({
        where: { user_id_workspace_id: { user_id, workspace_id } },
        include: { roles: true }
    });
    if (membership) {
        await redisClient_1.redis.set(key, JSON.stringify(membership), "EX", CACHE_TTL_SECONDS);
    }
    return membership;
};
exports.findMembership = findMembership;
const invalidateMembership = async (user_id, workspace_id) => {
    await redisClient_1.redis.del(`membership:${user_id}:${workspace_id}`);
};
exports.invalidateMembership = invalidateMembership;
const createWorkspaceMember = (data) => {
    return prisma_1.prisma.workspace_members.create({ data });
};
exports.createWorkspaceMember = createWorkspaceMember;
const updateWorkspaceMember = (workspace_member_id, data) => {
    return prisma_1.prisma.workspace_members.update({
        where: { workspace_member_id },
        data
    });
};
exports.updateWorkspaceMember = updateWorkspaceMember;
const deleteWorkspaceMember = (workspace_member_id) => {
    return prisma_1.prisma.workspace_members.delete({
        where: { workspace_member_id }
    });
};
exports.deleteWorkspaceMember = deleteWorkspaceMember;
const findByWorkspace = (workspace_id) => {
    return prisma_1.prisma.workspace_members.findMany({
        where: { workspace_id },
        include: {
            users: true,
            roles: true
        }
    });
};
exports.findByWorkspace = findByWorkspace;
