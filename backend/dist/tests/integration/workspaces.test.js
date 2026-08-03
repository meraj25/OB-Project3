"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../db/prisma");
const workspaces_service_1 = require("../../services/workspaces.service");
describe("createWorkspace — transactional integrity", () => {
    afterEach(async () => {
        await prisma_1.prisma.workspace_members.deleteMany({});
        await prisma_1.prisma.workspaces.deleteMany({});
        await prisma_1.prisma.users.deleteMany({ where: { user_name: "test1" } });
    });
    it("creates the workspace AND the owner membership row together", async () => {
        const user = await prisma_1.prisma.users.create({ data: { user_name: "test1", user_email: "t@test.com", user_password: "x" } });
        const workspace = await (0, workspaces_service_1.CreateWorkspace)({ workspace_name: "Test Workspace", created_by: user.user_id });
        const membership = await prisma_1.prisma.workspace_members.findUnique({
            where: { user_id_workspace_id: { user_id: user.user_id, workspace_id: workspace.workspace_id } }
        });
        expect(membership).not.toBeNull();
        expect(membership?.role_id).toBe(1);
    });
    it("never leaves a workspace with zero members if creation fails partway", async () => {
        await expect((0, workspaces_service_1.CreateWorkspace)({ workspace_name: "should fail", created_by: 99999 })).rejects.toThrow();
        const orphaned = await prisma_1.prisma.workspaces.findUnique({ where: { workspace_name: "Should Fail" } });
        expect(orphaned).toBeNull();
    });
});
