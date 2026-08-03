"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkspace = exports.updateWorkspace = exports.createWorkspace = exports.findWorkspaceByName = exports.findWorkspaceById = exports.findAllWorkspaces = void 0;
const prisma_1 = require("../db/prisma");
const findAllWorkspaces = () => {
    return prisma_1.prisma.workspaces.findMany();
};
exports.findAllWorkspaces = findAllWorkspaces;
const findWorkspaceById = (workspace_id) => {
    return prisma_1.prisma.workspaces.findUnique({
        where: { workspace_id }
    });
};
exports.findWorkspaceById = findWorkspaceById;
const findWorkspaceByName = (workspace_name) => {
    return prisma_1.prisma.workspaces.findUnique({
        where: { workspace_name }
    });
};
exports.findWorkspaceByName = findWorkspaceByName;
const createWorkspace = (data) => {
    return prisma_1.prisma.workspaces.create({
        data: {
            ...data,
            workspace_members: {
                create: { user_id: data.created_by, role_id: 1 }
            }
        },
        include: {
            workspace_members: {
                include: { users: true }
            }
        }
    });
};
exports.createWorkspace = createWorkspace;
const updateWorkspace = (workspace_id, data) => {
    return prisma_1.prisma.workspaces.update({ where: { workspace_id }, data });
};
exports.updateWorkspace = updateWorkspace;
const deleteWorkspace = (workspace_id) => {
    return prisma_1.prisma.workspaces.delete({ where: { workspace_id } });
};
exports.deleteWorkspace = deleteWorkspace;
