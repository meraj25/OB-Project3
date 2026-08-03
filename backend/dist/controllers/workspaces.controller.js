"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWorkspaceController = exports.UpdateWorkspaceController = exports.CreateWorkspaceController = exports.GetWorkspaceById = exports.GetAllWorkspaces = void 0;
const workspaces_service_1 = require("../services/workspaces.service");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const GetAllWorkspaces = async (req, res, next) => {
    try {
        const workspaces = await (0, workspaces_service_1.getAllWorkspaces)();
        res.status(200).json(workspaces);
    }
    catch (error) {
        next(error);
    }
};
exports.GetAllWorkspaces = GetAllWorkspaces;
const GetWorkspaceById = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        if (!workspace_id) {
            return new validation_error_1.default("workspace_id required");
        }
        const workspace = await (0, workspaces_service_1.getWorkspaceById)(workspace_id);
        res.status(200).json(workspace);
    }
    catch (error) {
        next(error);
    }
};
exports.GetWorkspaceById = GetWorkspaceById;
const CreateWorkspaceController = async (req, res, next) => {
    try {
        const created_by = req.user.user_id;
        const { workspace_name } = req.body;
        if (!workspace_name) {
            return new validation_error_1.default("name for the workspace is required");
        }
        const workspace = await (0, workspaces_service_1.CreateWorkspace)({ workspace_name, created_by });
        res.status(201).json(workspace);
    }
    catch (error) {
        next(error);
    }
};
exports.CreateWorkspaceController = CreateWorkspaceController;
const UpdateWorkspaceController = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const data = req.body;
        const workspace = await (0, workspaces_service_1.UpdateWorkspace)(workspace_id, data);
        res.status(200).json(workspace);
    }
    catch (error) {
        next(error);
    }
};
exports.UpdateWorkspaceController = UpdateWorkspaceController;
const DeleteWorkspaceController = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        if (!workspace_id) {
            return new validation_error_1.default("workspace_id required");
        }
        await (0, workspaces_service_1.DeleteWorkspace)(workspace_id);
        res.status(204).send("workspace deleted successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.DeleteWorkspaceController = DeleteWorkspaceController;
