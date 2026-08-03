"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProject = exports.UpdateProject = exports.CreateProject = exports.getProjectByName = exports.getProjectById = exports.getAllProjects = void 0;
const projects_repository_1 = require("../repositories/projects.repository");
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const getAllProjects = async (workspace_id) => {
    const projects = await (0, projects_repository_1.findAllProjectsByWorkspace)(workspace_id);
    return projects;
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (project_id, workspace_id) => {
    const project = await (0, projects_repository_1.findProjectById)(project_id);
    if (!project || project.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("Project not found!");
    }
    return project;
};
exports.getProjectById = getProjectById;
const getProjectByName = async (project_name, workspace_id) => {
    const projects = await (0, projects_repository_1.findByProjectName)(project_name);
    const project = projects.find((project) => project.workspace_id === workspace_id);
    if (!project) {
        throw new not_found_error_1.default("Project not found!");
    }
    return project;
};
exports.getProjectByName = getProjectByName;
const CreateProject = async (data) => {
    if (!data.project_name) {
        throw new validation_error_1.default("Project name is required");
    }
    return (0, projects_repository_1.createProject)(data);
};
exports.CreateProject = CreateProject;
const UpdateProject = async (workspace_id, project_id, data) => {
    const project = await (0, projects_repository_1.findProjectById)(project_id);
    if (!project || project.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("Project not found!");
    }
    return await (0, projects_repository_1.updateProject)(project_id, data);
};
exports.UpdateProject = UpdateProject;
const DeleteProject = async (workspace_id, project_id) => {
    const project = await (0, projects_repository_1.findProjectById)(project_id);
    if (!project || project.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("Project not found!");
    }
    return await (0, projects_repository_1.deleteProject)(project_id);
};
exports.DeleteProject = DeleteProject;
