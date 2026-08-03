"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationRecipients = exports.getIssueSubtree = exports.DeleteIssue = exports.UpdateIssue = exports.CreateIssue = exports.getIssueByName = exports.getIssueById = exports.getAllIssues = void 0;
const issues_repository_1 = require("../repositories/issues.repository");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const createIssue_dto_1 = require("../domain/dto/createIssue.dto");
const projects_repository_1 = require("../repositories/projects.repository");
const backgroundJobs_repository_1 = require("../repositories/backgroundJobs.repository");
const issues_repository_2 = require("../repositories/issues.repository");
const VALID_SORT_FIELDS = ["issue_id", "issue_status", "issue_priority", "created_at"];
const structured_issues = (issue) => ({
    ...issue,
    assignee: issue.issue_assignees?.map((ia) => ia.users) ?? [],
    reporter: issue.users,
    labels: issue.issue_labels?.map((ia) => ia.labels) ?? [],
    project: issue.projects,
    users: undefined,
    issue_labels: undefined,
    issue_assignees: undefined,
    projects: undefined
});
const getAllIssues = async (query, project_id, workspace_id) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
    const assignee = query.assignee ? Number(query.assignee) : undefined;
    if (query.assignee && isNaN(assignee)) {
        throw { status: 400, message: "assignee must be a valid number" };
    }
    const reporter = query.reporter ? Number(query.reporter) : undefined;
    if (query.reporter && isNaN(reporter)) {
        throw { status: 400, message: "reporter must be a valid number" };
    }
    const validStatus = ["To Check", "In Progress", "Resolved"];
    if (query.status && !validStatus.includes(query.status)) {
        throw { status: 400, message: "Invalid status value" };
    }
    const search = query.search?.trim() || undefined;
    if (search && search.length > 200) {
        throw { status: 400, message: "search term is too long" };
    }
    const sortBy = query.sortBy && VALID_SORT_FIELDS.includes(query.sortBy) ? query.sortBy : "issue_id";
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    const validPriority = ["Low", "Medium", "High"];
    if (query.priority && !validPriority.includes(query.priority)) {
        throw { status: 400, message: "Invalid priority value" };
    }
    const project = await (0, projects_repository_1.findProjectById)(project_id);
    if (!project || project.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("Project not found");
    }
    const { issues, totalCount } = await (0, issues_repository_1.findAllIssues)({
        project_id,
        status: query.status,
        assignee,
        reporter,
        priority: query.priority,
        labels: query.labels,
        search: query.search,
        sortBy,
        sortOrder,
        page,
        limit,
    });
    return {
        data: issues.map(structured_issues),
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    };
};
exports.getAllIssues = getAllIssues;
const getIssueById = async (issue_id, project_id, workspace_id) => {
    const issue = await (0, issues_repository_1.findIssueById)(issue_id);
    if (!issue ||
        issue.project_id !== project_id ||
        issue.projects.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("issue not found!");
    }
    return structured_issues(issue);
};
exports.getIssueById = getIssueById;
const getIssueByName = async (issue_name, project_id, workspace_id) => {
    const issues = await (0, issues_repository_1.findIssueByName)(issue_name);
    const issue = issues.find((issue) => issue.project_id === project_id && issue.projects.workspace_id === workspace_id);
    if (!issue) {
        throw new not_found_error_1.default("issue not found!");
    }
    return structured_issues(issue);
};
exports.getIssueByName = getIssueByName;
const CreateIssue = async (data, workspace_id) => {
    const project = await (0, projects_repository_1.findProjectById)(data.project_id);
    if (!project || project.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("Project not found");
    }
    const parsed = createIssue_dto_1.createIssueSchema.safeParse(data);
    if (!parsed.success) {
        throw new validation_error_1.default("validation error");
    }
    const issue = await (0, issues_repository_1.createIssue)(parsed.data);
    const fullIssue = await (0, issues_repository_2.findIssueWithPeople)(issue.issue_id);
    const recipients = getNotificationRecipients(fullIssue);
    if (recipients.length > 0) {
        await (0, backgroundJobs_repository_1.enqueueJob)("issue_assigned_email", {
            issue_id: issue.issue_id,
            issue_name: issue.issue_name,
            recipients,
        });
    }
    return issue;
};
exports.CreateIssue = CreateIssue;
const UpdateIssue = async (issue_id, project_id, workspace_id, data) => {
    try {
        const issue = await (0, issues_repository_1.findIssueById)(issue_id);
        if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
            throw new not_found_error_1.default("issue not found!");
        }
        const parsed = createIssue_dto_1.updateIssueSchema.safeParse(data);
        if (!parsed.success) {
            throw new validation_error_1.default("Bad request");
        }
        const updated = await (0, issues_repository_1.updateIssue)(issue_id, parsed.data);
        const fullIssue = await (0, issues_repository_2.findIssueWithPeople)(issue_id);
        const recipients = getNotificationRecipients(fullIssue);
        if (recipients.length > 0) {
            await (0, backgroundJobs_repository_1.enqueueJob)("issue_updated_email", {
                issue_id,
                issue_name: fullIssue.issue_name,
                changes: parsed.data,
                recipients,
            });
        }
        return updated;
    }
    catch (error) {
        throw error;
    }
};
exports.UpdateIssue = UpdateIssue;
const DeleteIssue = async (issue_id, project_id, workspace_id) => {
    const issue = await (0, issues_repository_1.findIssueById)(issue_id);
    if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("issue not found!");
    }
    const fullIssue = await (0, issues_repository_2.findIssueWithPeople)(issue_id);
    const recipients = getNotificationRecipients(fullIssue);
    if (recipients.length > 0) {
        await (0, backgroundJobs_repository_1.enqueueJob)("issue_deleted_email", {
            issue_id,
            issue_name: fullIssue.issue_name,
            recipients,
        });
    }
    return await (0, issues_repository_1.deleteIssue)(issue_id);
};
exports.DeleteIssue = DeleteIssue;
const getIssueSubtree = async (issue_id, project_id, workspace_id) => {
    const issue = await (0, issues_repository_1.findIssueById)(issue_id);
    if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
        throw new not_found_error_1.default("issue not found!");
    }
    return (0, issues_repository_1.findIssueSubtree)(issue_id);
};
exports.getIssueSubtree = getIssueSubtree;
const getNotificationRecipients = (issue) => {
    const emails = new Set();
    if (issue.users?.user_email) {
        emails.add(issue.users.user_email);
    }
    issue.issue_assignees?.forEach((ia) => {
        if (ia.users?.user_email)
            emails.add(ia.users.user_email);
    });
    return Array.from(emails);
};
exports.getNotificationRecipients = getNotificationRecipients;
