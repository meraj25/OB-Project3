"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBlockedIssue = exports.CreateBlockedIssue = exports.getBlockedIssueById = exports.getAllBlockedIssues = void 0;
const block_issues_repository_1 = require("../repositories/block_issues.repository");
const issues_repository_1 = require("../repositories/issues.repository");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const getAllBlockedIssues = async () => {
    return (0, block_issues_repository_1.findAllBlockedIssues)();
};
exports.getAllBlockedIssues = getAllBlockedIssues;
const getBlockedIssueById = async (blocked_issue_id, blocking_issue_id, project_id, workspace_id) => {
    const link = await (0, block_issues_repository_1.findBlockedIssueById)(blocked_issue_id, blocking_issue_id);
    if (!link) {
        throw new not_found_error_1.default("Blocking link not found");
    }
    const [blockedIssue, blockingIssue] = await Promise.all([
        (0, issues_repository_1.findIssueById)(blocked_issue_id),
        (0, issues_repository_1.findIssueById)(blocking_issue_id),
    ]);
    const belongsHere = (issue) => issue && issue.project_id === project_id && issue.projects.workspace_id === workspace_id;
    if (!belongsHere(blockedIssue) || !belongsHere(blockingIssue)) {
        throw new not_found_error_1.default("Blocking link not found");
    }
    return link;
};
exports.getBlockedIssueById = getBlockedIssueById;
const CreateBlockedIssue = async (blocking_issue_id, blocked_issue_id, project_id, workspace_id) => {
    if (!blocking_issue_id || !blocked_issue_id) {
        throw new validation_error_1.default("blocking_issue_id and blocked_issue_id are required");
    }
    if (blocking_issue_id === blocked_issue_id) {
        throw new validation_error_1.default("An issue cannot block itself");
    }
    const [blockingIssue, blockedIssue] = await Promise.all([
        (0, issues_repository_1.findIssueById)(blocking_issue_id),
        (0, issues_repository_1.findIssueById)(blocked_issue_id),
    ]);
    const belongsHere = (issue) => issue && issue.project_id === project_id && issue.projects.workspace_id === workspace_id;
    if (!belongsHere(blockingIssue) || !belongsHere(blockedIssue)) {
        throw new not_found_error_1.default("One or both issues not found");
    }
    if (await (0, block_issues_repository_1.wouldCreateCycle)(blocking_issue_id, blocked_issue_id)) {
        throw new validation_error_1.default("This link would create a circular dependency!");
    }
    return (0, block_issues_repository_1.createBlockedIssueById)({ blocking_issue_id, blocked_issue_id });
};
exports.CreateBlockedIssue = CreateBlockedIssue;
const DeleteBlockedIssue = async (blocked_issue_id, blocking_issue_id) => {
    const link = await (0, block_issues_repository_1.findBlockedIssueById)(blocked_issue_id, blocking_issue_id);
    if (!link) {
        throw new not_found_error_1.default("Blocking link not found");
    }
    return (0, block_issues_repository_1.deleteBlockedIssueId)(blocked_issue_id, blocking_issue_id);
};
exports.DeleteBlockedIssue = DeleteBlockedIssue;
