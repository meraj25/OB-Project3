import { z } from "zod"

const createIssueSchema = z.object({
    issue_name: z.string().min(1, { message: "Issue name is required" }),
    issue_description: z.string().optional(),
    issue_status: z.enum(["To Check", "In Progress", "Resolved"]),
    issue_priority: z.enum(["Low", "Medium", "High"]),
    issue_reporter: z.number().int().positive({ message: "Reporter ID must be a positive integer" }),
    project_id: z.number().int().positive({ message: "Project ID must be a positive integer" }),
    assignee_ids: z.array(z.number().int().positive({ message: "Assignee IDs must be positive integers" })).optional(),
    
});

const updateIssueSchema = createIssueSchema.omit({ issue_reporter: true, project_id: true }).partial();

export { createIssueSchema, updateIssueSchema };