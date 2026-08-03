"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWorkspace = exports.UpdateWorkspace = exports.CreateWorkspace = exports.getWorkspaceById = exports.getAllWorkspaces = void 0;
const workspaces_repository_1 = require("../repositories/workspaces.repository");
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const getAllWorkspaces = async () => {
    const workspaces = await (0, workspaces_repository_1.findAllWorkspaces)();
    return workspaces;
};
exports.getAllWorkspaces = getAllWorkspaces;
const getWorkspaceById = async (workspace_id) => {
    const workspace = await (0, workspaces_repository_1.findWorkspaceById)(workspace_id);
    if (!workspace) {
        throw new not_found_error_1.default("task now found!");
    }
    return workspace;
};
exports.getWorkspaceById = getWorkspaceById;
const CreateWorkspace = async (data) => {
    const workspace = await (0, workspaces_repository_1.createWorkspace)(data);
    return workspace;
};
exports.CreateWorkspace = CreateWorkspace;
const UpdateWorkspace = async (workspace_id, data) => {
    const workspace = await (0, workspaces_repository_1.findWorkspaceById)(workspace_id);
    if (!workspace) {
        throw new not_found_error_1.default("Not found!");
    }
    return await (0, workspaces_repository_1.updateWorkspace)(workspace_id, data);
};
exports.UpdateWorkspace = UpdateWorkspace;
const DeleteWorkspace = async (workspace_id) => {
    const workspace = await (0, workspaces_repository_1.findWorkspaceById)(workspace_id);
    if (!workspace) {
        throw new not_found_error_1.default("Not found!");
    }
    return await (0, workspaces_repository_1.deleteWorkspace)(workspace_id);
};
exports.DeleteWorkspace = DeleteWorkspace;
