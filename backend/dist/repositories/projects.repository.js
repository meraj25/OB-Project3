"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.findProjectById = exports.findByProjectName = exports.findAllProjectsByWorkspace = void 0;
const prisma_1 = require("../db/prisma");
const findAllProjectsByWorkspace = (workspace_id) => {
    return prisma_1.prisma.projects.findMany({
        where: { workspace_id },
        include: { workspaces: true,
            issues: {
                include: { users: true },
            }
        }
    });
};
exports.findAllProjectsByWorkspace = findAllProjectsByWorkspace;
const findProjectById = (project_id) => {
    return prisma_1.prisma.projects.findUnique({
        where: { project_id },
        include: {
            workspaces: true,
            issues: {
                include: { users: true }
            }
        }
    });
};
exports.findProjectById = findProjectById;
const findByProjectName = (project_name) => {
    return prisma_1.prisma.projects.findMany({
        where: { project_name },
        include: {
            workspaces: true,
            issues: {
                include: { users: true }
            }
        }
    });
};
exports.findByProjectName = findByProjectName;
const createProject = (data) => {
    return prisma_1.prisma.projects.create({
        data,
        include: {
            workspaces: true,
        }
    });
};
exports.createProject = createProject;
const updateProject = (project_id, data) => {
    return prisma_1.prisma.projects.update({ where: { project_id }, data });
};
exports.updateProject = updateProject;
const deleteProject = (project_id) => {
    return prisma_1.prisma.projects.delete({ where: { project_id } });
};
exports.deleteProject = deleteProject;
