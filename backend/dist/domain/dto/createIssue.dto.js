"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIssueSchema = exports.createIssueSchema = void 0;
const zod_1 = require("zod");
const createIssueSchema = zod_1.z.object({
    issue_name: zod_1.z.string().min(1, { message: "Issue name is required" }),
    issue_description: zod_1.z.string().optional(),
    issue_status: zod_1.z.enum(["To Check", "In Progress", "Resolved"]),
    issue_priority: zod_1.z.enum(["Low", "Medium", "High"]),
    issue_reporter: zod_1.z.number().int().positive({ message: "Reporter ID must be a positive integer" }),
    project_id: zod_1.z.number().int().positive({ message: "Project ID must be a positive integer" }),
    assignee_ids: zod_1.z.array(zod_1.z.number().int().positive({ message: "Assignee IDs must be positive integers" })).optional(),
});
exports.createIssueSchema = createIssueSchema;
const updateIssueSchema = createIssueSchema.omit({ issue_reporter: true, project_id: true }).partial();
exports.updateIssueSchema = updateIssueSchema;
