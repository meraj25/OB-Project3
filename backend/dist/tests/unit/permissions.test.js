"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permissions_1 = require("../../domain/permissions");
describe("permission()", () => {
    it("owner can do everything", () => {
        expect((0, permissions_1.permission)(1, "workspace:delete")).toBe(true);
        expect((0, permissions_1.permission)(1, "member:changeRole")).toBe(true);
    });
    it("exco members can not update or delete the workspace", () => {
        expect((0, permissions_1.permission)(2, "workspace:update")).toBe(false);
        expect((0, permissions_1.permission)(2, "workspace:delete")).toBe(false);
    });
    it("exco members can not change member roles", () => {
        expect((0, permissions_1.permission)(2, "member:changeRole")).toBe(false);
    });
    it("exco-member can only create/update issues", () => {
        expect((0, permissions_1.permission)(2, "issue:create")).toBe(true);
        expect((0, permissions_1.permission)(3, "issue:delete")).toBe(false);
        expect((0, permissions_1.permission)(3, "project:create")).toBe(false);
    });
    it("viewer can do nothing", () => {
        expect((0, permissions_1.permission)(4, "issue:create")).toBe(false);
    });
    it("unknown role_id defaults to no permissions (fail closed)", () => {
        expect((0, permissions_1.permission)(999, "issue:create")).toBe(false);
    });
});
