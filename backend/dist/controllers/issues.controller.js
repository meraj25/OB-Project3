"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportIssuesCSV = exports.GetIssueSubtree = exports.DeleteIssueController = exports.UpdateIssueController = exports.CreateIssueController = exports.GetIssueByName = exports.GetIssueById = exports.GetAllIssues = void 0;
const issues_service_1 = require("../services/issues.service");
const projects_repository_1 = require("../repositories/projects.repository");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const prisma_1 = require("../db/prisma");
const GetAllIssues = async (req, res, next) => {
    try {
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        const issues = await (0, issues_service_1.getAllIssues)(req.query, project_id, workspace_id);
        res.status(200).json(issues);
    }
    catch (error) {
        next(error);
    }
};
exports.GetAllIssues = GetAllIssues;
const GetIssueById = async (req, res, next) => {
    try {
        const issue_id = Number(req.params.issue_id);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        if (isNaN(workspace_id) || isNaN(project_id) || isNaN(issue_id)) {
            throw new validation_error_1.default("Invalid id");
        }
        const issue = await (0, issues_service_1.getIssueById)(issue_id, project_id, workspace_id);
        res.status(200).json(issue);
    }
    catch (error) {
        next(error);
    }
};
exports.GetIssueById = GetIssueById;
const GetIssueByName = async (req, res, next) => {
    try {
        const issue_name = String(req.params.issue_name);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        if (!issue_name) {
            return new validation_error_1.default("Required issue_name");
        }
        if (!project_id) {
            return new validation_error_1.default("Required project_id");
        }
        const issue = await (0, issues_service_1.getIssueByName)(issue_name, project_id, workspace_id);
        res.status(200).json(issue);
    }
    catch (error) {
        next(error);
    }
};
exports.GetIssueByName = GetIssueByName;
const CreateIssueController = async (req, res, next) => {
    try {
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        if (isNaN(project_id) || isNaN(workspace_id)) {
            throw new validation_error_1.default("Invalid project or workspace id");
        }
        const data = req.body;
        const issue = await (0, issues_service_1.CreateIssue)({ ...data, project_id }, workspace_id);
        res.status(201).json(issue);
    }
    catch (error) {
        next(error);
    }
};
exports.CreateIssueController = CreateIssueController;
const UpdateIssueController = async (req, res, next) => {
    try {
        const issue_id = Number(req.params.issue_id);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        const data = req.body;
        const issue = await (0, issues_service_1.UpdateIssue)(issue_id, project_id, workspace_id, data);
        res.status(200).json(issue);
    }
    catch (error) {
        next(error);
    }
};
exports.UpdateIssueController = UpdateIssueController;
const DeleteIssueController = async (req, res, next) => {
    try {
        const issue_id = Number(req.params.issue_id);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        await (0, issues_service_1.DeleteIssue)(issue_id, project_id, workspace_id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.DeleteIssueController = DeleteIssueController;
const GetIssueSubtree = async (req, res, next) => {
    try {
        const issue_id = Number(req.params.issue_id);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        if (isNaN(issue_id) || isNaN(project_id) || isNaN(workspace_id)) {
            throw new validation_error_1.default("Invalid id");
        }
        const tree = await (0, issues_service_1.getIssueSubtree)(issue_id, project_id, workspace_id);
        res.status(200).json(tree);
    }
    catch (error) {
        next(error);
    }
};
exports.GetIssueSubtree = GetIssueSubtree;
const ExportIssuesCSV = async (req, res, next) => {
    try {
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        if (isNaN(project_id) || isNaN(workspace_id)) {
            throw new validation_error_1.default("Invalid id");
        }
        const project = await (0, projects_repository_1.findProjectById)(project_id);
        if (!project || project.workspace_id !== workspace_id) {
            throw new not_found_error_1.default("Project not found");
        }
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="issues.csv"`);
        res.write("issue_id,issue_name,issue_status,issue_priority\n");
        const BATCH_SIZE = 500;
        let cursor;
        while (true) {
            const batch = await prisma_1.prisma.issues.findMany({
                where: { project_id },
                take: BATCH_SIZE,
                ...(cursor && { skip: 1, cursor: { issue_id: cursor } }),
                orderBy: { issue_id: "asc" },
            });
            if (batch.length === 0)
                break;
            for (const issue of batch) {
                res.write(`${issue.issue_id},"${issue.issue_name}",${issue.issue_status},${issue.issue_priority}\n`);
            }
            cursor = batch[batch.length - 1].issue_id;
            if (batch.length < BATCH_SIZE)
                break;
        }
        res.end();
    }
    catch (error) {
        next(error);
    }
};
exports.ExportIssuesCSV = ExportIssuesCSV;
