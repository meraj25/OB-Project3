import {prisma} from "../../db/prisma"
import { CreateWorkspace } from "../../services/workspaces.service"

describe("createWorkspace — transactional integrity", () => {
    afterEach(async () => {
        await prisma.workspace_members.deleteMany({});
        await prisma.workspaces.deleteMany({});
        await prisma.users.deleteMany({ where: { user_name: "test1" } });
    });

    it("creates the workspace AND the owner membership row together", async () => {
        const user = await prisma.users.create({ data: { user_name: "test1", user_email: "t@test.com", user_password: "x" } });

        const workspace = await CreateWorkspace( {workspace_name:"Test Workspace",created_by:user.user_id});

        const membership = await prisma.workspace_members.findUnique({
            where: { user_id_workspace_id: { user_id: user.user_id, workspace_id: workspace.workspace_id } }
        });

        expect(membership).not.toBeNull();
        expect(membership?.role_id).toBe(1); 
    });

    it("never leaves a workspace with zero members if creation fails partway", async () => {
       
        await expect(CreateWorkspace({workspace_name:"should fail",created_by:99999})).rejects.toThrow();

        const orphaned = await prisma.workspaces.findUnique({ where: { workspace_name: "Should Fail" } });
        expect(orphaned).toBeNull(); 
    });
});