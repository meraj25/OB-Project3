"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProjectController = exports.UpdateProjectController = exports.CreateProjectController = exports.GetProjectById = exports.GetAllProjects = void 0;
const projects_service_1 = require("../services/projects.service");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const GetAllProjects = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const projects = await (0, projects_service_1.getAllProjects)(workspace_id);
        res.status(200).json(projects);
    }
    catch (error) {
        next(error);
    }
};
exports.GetAllProjects = GetAllProjects;
const GetProjectById = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const project_id = Number(req.params.project_id);
        if (isNaN(project_id))
            throw new validation_error_1.default("Invalid project id");
        const project = await (0, projects_service_1.getProjectById)(workspace_id, project_id);
        res.status(200).json(project);
    }
    catch (error) {
        next(error);
    }
};
exports.GetProjectById = GetProjectById;
const CreateProjectController = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const { project_name } = req.body;
        const project = await (0, projects_service_1.CreateProject)({ workspace_id, project_name });
        res.status(201).json(project);
    }
    catch (error) {
        next(error);
    }
};
exports.CreateProjectController = CreateProjectController;
const UpdateProjectController = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const project_id = Number(req.params.project_id);
        const project_name = req.body;
        const project = await (0, projects_service_1.UpdateProject)(workspace_id, project_id, project_name);
        res.status(201).json(project);
    }
    catch (error) {
        next(error);
    }
};
exports.UpdateProjectController = UpdateProjectController;
const DeleteProjectController = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const project_id = Number(req.params.project_id);
        await (0, projects_service_1.DeleteProject)(workspace_id, project_id);
        res.status(201).send();
    }
    catch (error) {
        next(error);
    }
};
exports.DeleteProjectController = DeleteProjectController;
