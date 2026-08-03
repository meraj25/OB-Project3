"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const __1 = __importDefault(require("../.."));
const prisma_1 = require("../../db/prisma");
describe("testing issue api's", () => {
    let cookie;
    let workspaceId;
    let projectId;
    let userId;
    const testUsername = `tester_${Date.now()}`;
    beforeAll(async () => {
        await (0, supertest_1.default)(__1.default).post("/api/users/register").send({ user_email: "testuser123@email.com", user_name: testUsername, user_password: "Password123!" });
        const loginRes = await (0, supertest_1.default)(__1.default).post("/api/users/login").send({ user_email: "testuser123@email.com", user_password: "Password123!" });
        cookie = loginRes.headers["set-cookie"][0];
        userId = loginRes.body.user_id;
        const wsRes = await (0, supertest_1.default)(__1.default).post("/api/workspaces/create").set("Cookie", cookie).send({ workspace_name: "Test WS", created_by: 1 });
        workspaceId = wsRes.body.workspace_id;
        const projRes = await (0, supertest_1.default)(__1.default).post(`/api/projects/workspace/${workspaceId}/project/create`).set("Cookie", cookie).send({ workspace_id: workspaceId, project_name: "Test Project" });
        projectId = projRes.body.project_id;
    });
    afterAll(async () => {
        await prisma_1.prisma.issues.deleteMany({ where: { project_id: projectId } });
        await prisma_1.prisma.projects.deleteMany({ where: { workspace_id: workspaceId } });
        await prisma_1.prisma.workspace_members.deleteMany({ where: { workspace_id: workspaceId } });
        await prisma_1.prisma.workspaces.deleteMany({ where: { workspace_id: workspaceId } });
        await prisma_1.prisma.users.deleteMany({ where: { user_name: testUsername } });
    });
    describe("GET /issues (unauthenticated)", () => {
        it("returns 401 with no token", async () => {
            const res = await (0, supertest_1.default)(__1.default).get(`/api/issues/workspace/${workspaceId}/project/${projectId}/issues`);
            expect(res.status).toBe(401);
        });
    });
    describe("GET /issues in a workspace the user doesn't belong to", () => {
        it("returns 404, not 403 (no leak)", async () => {
            const res = await (0, supertest_1.default)(__1.default)
                .get(`/api/issues/workspace/999999/project/1/issues`)
                .set("Cookie", cookie);
            expect(res.status).toBe(404);
        });
    });
    describe(" correct flow for issue interactions", () => {
        it("creates, reads, updates, and deletes an issue", async () => {
            const create = await (0, supertest_1.default)(__1.default)
                .post(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/create`)
                .set("Cookie", cookie)
                .send({ issue_name: "Test issue", issue_reporter: userId, issue_priority: "Low", issue_status: "To Check" });
            expect(create.status).toBe(201);
            const issueId = create.body.issue_id;
            console.log("create response:", create.body);
            const get = await (0, supertest_1.default)(__1.default)
                .get(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}`)
                .set("Cookie", cookie);
            expect(get.status).toBe(200);
            const update = await (0, supertest_1.default)(__1.default)
                .patch(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}`)
                .set("Cookie", cookie)
                .send({ issue_status: "In Progress" });
            expect(update.status).toBe(200);
            const del = await (0, supertest_1.default)(__1.default)
                .delete(`/api/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}`)
                .set("Cookie", cookie);
            expect(del.status).toBe(204);
        });
    });
});
