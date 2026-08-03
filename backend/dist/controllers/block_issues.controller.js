"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBlockedIssueController = exports.CreateBlockedIssueController = exports.GetBlockedIssueById = exports.GetAllBlockedIssues = void 0;
const block_issues_service_1 = require("../services/block_issues.service");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const GetAllBlockedIssues = async (req, res, next) => {
    try {
        const links = await (0, block_issues_service_1.getAllBlockedIssues)();
        res.status(200).json(links);
    }
    catch (error) {
        next(error);
    }
};
exports.GetAllBlockedIssues = GetAllBlockedIssues;
const GetBlockedIssueById = async (req, res, next) => {
    try {
        const blocked_issue_id = Number(req.params.blocked_issue_id);
        const blocking_issue_id = Number(req.params.blocking_issue_id);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        if (isNaN(blocked_issue_id) || isNaN(blocking_issue_id) || isNaN(project_id) || isNaN(workspace_id)) {
            throw new validation_error_1.default("Invalid id");
        }
        const link = await (0, block_issues_service_1.getBlockedIssueById)(blocked_issue_id, blocking_issue_id, project_id, workspace_id);
        res.status(200).json(link);
    }
    catch (error) {
        next(error);
    }
};
exports.GetBlockedIssueById = GetBlockedIssueById;
const CreateBlockedIssueController = async (req, res, next) => {
    try {
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        const { blocking_issue_id, blocked_issue_id } = req.body;
        if (isNaN(project_id) || isNaN(workspace_id)) {
            throw new validation_error_1.default("Invalid project or workspace id");
        }
        const link = await (0, block_issues_service_1.CreateBlockedIssue)(Number(blocking_issue_id), Number(blocked_issue_id), project_id, workspace_id);
        res.status(201).json(link);
    }
    catch (error) {
        next(error);
    }
};
exports.CreateBlockedIssueController = CreateBlockedIssueController;
const DeleteBlockedIssueController = async (req, res, next) => {
    try {
        const blocked_issue_id = Number(req.params.blocked_issue_id);
        const blocking_issue_id = Number(req.params.blocking_issue_id);
        if (isNaN(blocked_issue_id) || isNaN(blocking_issue_id)) {
            throw new validation_error_1.default("Invalid id");
        }
        await (0, block_issues_service_1.DeleteBlockedIssue)(blocked_issue_id, blocking_issue_id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.DeleteBlockedIssueController = DeleteBlockedIssueController;
