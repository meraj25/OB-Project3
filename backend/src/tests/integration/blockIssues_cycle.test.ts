import { prisma } from "../../db/prisma";
import { wouldCreateCycle } from "../../repositories/block_issues.repository";

describe("wouldCreateCycle", () => {
    let issueIds: number[];
    let workspaceId: number;
    let projectId: number;
    let userId: number;
    const uniqueId = Date.now();

    beforeAll(async () => {
        const user = await prisma.users.create({
            data: {
                user_name: `cycletest_${uniqueId}`,
                user_email: `cycle_${uniqueId}@test.com`,
                user_password: "x"
            }
        });
        userId = user.user_id;

        const workspace = await prisma.workspaces.create({
            data: { workspace_name: `Cycle Test WS ${uniqueId}`, created_by: userId }
        });
        workspaceId = workspace.workspace_id;

        const project = await prisma.projects.create({
            data: { project_name: `Cycle Test Project ${uniqueId}`, workspace_id: workspaceId }
        });
        projectId = project.project_id;

        const issues = await Promise.all([1, 2, 3].map(n =>
            prisma.issues.create({
                data: {
                    issue_name: `Issue ${n}`,
                    issue_status: "To Check",
                    issue_priority: "Low",
                    issue_reporter: userId,
                    project_id: projectId
                }
            })
        ));
        issueIds = issues.map(i => i.issue_id);

        await prisma.block_issues.create({ data: { blocking_issue_id: issueIds[0], blocked_issue_id: issueIds[1] } });
        await prisma.block_issues.create({ data: { blocking_issue_id: issueIds[1], blocked_issue_id: issueIds[2] } });
    });

    afterAll(async () => {
        await prisma.block_issues.deleteMany({});
        if (issueIds) await prisma.issues.deleteMany({ where: { issue_id: { in: issueIds } } });
        if (projectId) await prisma.projects.delete({ where: { project_id: projectId } });
        if (workspaceId) {
            await prisma.workspace_members.deleteMany({ where: { workspace_id: workspaceId } });
            await prisma.workspaces.delete({ where: { workspace_id: workspaceId } });
        }
        if (userId) await prisma.users.delete({ where: { user_id: userId } });
    });

    it("detects a direct cycle (A blocks B, B blocks A)", async () => {
        const result = await wouldCreateCycle(issueIds[1], issueIds[0]);
        expect(result).toBe(true);
    });

    it("detects an indirect cycle (A→B→C, proposing C→A)", async () => {
        const result = await wouldCreateCycle(issueIds[2], issueIds[0]);
        expect(result).toBe(true);
    });

    it("allows a valid, non-cyclic link", async () => {
        const newIssue = await prisma.issues.create({
            data: { issue_name: "Issue 4", issue_status: "To Check", issue_priority: "Low", issue_reporter: userId, project_id: projectId }
        });
        const result = await wouldCreateCycle(issueIds[2], newIssue.issue_id);
        expect(result).toBe(false);
        await prisma.issues.delete({ where: { issue_id: newIssue.issue_id } });
    });
});