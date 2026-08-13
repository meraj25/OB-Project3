import request from "supertest"
import app from "../../app";
import {prisma} from "../../db/prisma"


describe("testing issue api's", () => {
    let cookie: string;
    let workspaceId: number;
    let projectId: number;
    let userId: number;
    const testUsername = `tester_${Date.now()}`;

    beforeAll(async () => {
        await request(app).post("/api/users/register").send({ user_email:"testuser123@email.com",user_name: testUsername, user_password: "Password123!" });
        const loginRes = await request(app).post("/api/users/login").send({ user_email:"testuser123@email.com", user_password: "Password123!" });
        cookie = loginRes.headers["set-cookie"][0];
        userId = loginRes.body.user_id;

        const wsRes = await request(app).post("/api/workspaces/create").set("Cookie", cookie).send({ workspace_name: "Test WS",created_by: 1 });
        workspaceId = wsRes.body.workspace_id;

        const projRes = await request(app).post(`/api/projects/workspace/${workspaceId}/project/create`).set("Cookie", cookie).send({ workspace_id:workspaceId,project_name: "Test Project" });
        projectId = projRes.body.project_id;
    });
    afterAll(async () => {
        await prisma.issues.deleteMany({ where: { project_id: projectId } });
        await prisma.projects.deleteMany({ where: { workspace_id: workspaceId } });
        await prisma.workspace_members.deleteMany({ where: { workspace_id: workspaceId } });
        await prisma.workspaces.deleteMany({ where: { workspace_id: workspaceId } });
        await prisma.users.deleteMany({ where: { user_name: testUsername } });
    });

    describe("GET /issues (unauthenticated)", () => {
    it("returns 401 with no token", async () => {
        const res = await request(app).get(`/api/issues/workspace/${workspaceId}/project/${projectId}/issues`);
        expect(res.status).toBe(401);
        });
    });

    describe("GET /issues in a workspace the user doesn't belong to", () => {
    it("returns 404, not 403 (no leak)", async () => {
        const res = await request(app)
            .get(`/api/issues/workspace/999999/project/1/issues`)
            .set("Cookie", cookie);
        expect(res.status).toBe(404);
        });
    });


    describe(" correct flow for issue interactions", () => {
        it("creates, reads, updates, and deletes an issue", async () => {
            const create = await request(app)
                .post(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/create`)
                .set("Cookie", cookie)
                .send({ issue_name: "Test issue", issue_reporter: userId , issue_priority: "Low", issue_status: "To Check" });
            expect(create.status).toBe(201);

            const issueId = create.body.issue_id;
            console.log("create response:", create.body);

            const get = await request(app)
                .get(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}`)
                .set("Cookie", cookie);
            expect(get.status).toBe(200);

            const update = await request(app)
                .patch(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}`)
                .set("Cookie", cookie)
                .send({ issue_status: "In Progress" });
            expect(update.status).toBe(200);

            const del = await request(app)
                .delete(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}`)
                .set("Cookie", cookie);
            expect(del.status).toBe(204);
        });
    });
})

