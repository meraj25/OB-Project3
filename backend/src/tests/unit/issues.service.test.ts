import NotFoundError from "../../domain/errors/not-found-error";
import { getIssueById } from "../../services/issues.service";
import * as issuesRepo from "../../repositories/issues.repository"

jest.mock("../../repositories/issues.repository");

describe("get IssueById (according to tenet-isolation)", () => {

    it("throws NotFoundError if issue belongs to a different project", async() => {

        (issuesRepo.findIssueById as jest.Mock).mockResolvedValue({
            issue_id: 1,
            project_id: 1,                          
            projects: { workspace_id: 1 }
        })
        await expect(getIssueById(1, 110, 1))
        .rejects.toThrow(NotFoundError);
    })

    it("throws NotFoundError if project belongs to a different workspace", async () => {
        (issuesRepo.findIssueById as jest.Mock).mockResolvedValue({
            issue_id: 1,
            project_id: 5,
            projects: { workspace_id: 1 }            
        });

        await expect(getIssueById(1, 5, 99 ))
        .rejects.toThrow(NotFoundError);
    });

    it("returns the issue when the full chain matches", async () => {
        (issuesRepo.findIssueById as jest.Mock).mockResolvedValue({
            
            issue_id: 1, project_id: 5, projects: { workspace_id: 1 },
            users: null, issue_assignees: [], issue_labels: []
        });

        const result = await getIssueById(1, 5, 1);
        expect(result.issue_id).toBe(1);
    });


})



