"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_error_1 = __importDefault(require("../../domain/errors/not-found-error"));
const issues_service_1 = require("../../services/issues.service");
const issuesRepo = __importStar(require("../../repositories/issues.repository"));
jest.mock("../../repositories/issues.repository");
describe("get IssueById (according to tenet-isolation)", () => {
    it("throws NotFoundError if issue belongs to a different project", async () => {
        issuesRepo.findIssueById.mockResolvedValue({
            issue_id: 1,
            project_id: 1,
            projects: { workspace_id: 1 }
        });
        await expect((0, issues_service_1.getIssueById)(1, 110, 1))
            .rejects.toThrow(not_found_error_1.default);
    });
    it("throws NotFoundError if project belongs to a different workspace", async () => {
        issuesRepo.findIssueById.mockResolvedValue({
            issue_id: 1,
            project_id: 5,
            projects: { workspace_id: 1 }
        });
        await expect((0, issues_service_1.getIssueById)(1, 5, 99))
            .rejects.toThrow(not_found_error_1.default);
    });
    it("returns the issue when the full chain matches", async () => {
        issuesRepo.findIssueById.mockResolvedValue({
            issue_id: 1, project_id: 5, projects: { workspace_id: 1 },
            users: null, issue_assignees: [], issue_labels: []
        });
        const result = await (0, issues_service_1.getIssueById)(1, 5, 1);
        expect(result.issue_id).toBe(1);
    });
});
