"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMember = exports.UpdateMember = exports.CreateMember = exports.GetAllWorkspaceMembers = void 0;
const workspace_members_service_1 = require("../services/workspace_members.service");
const GetAllWorkspaceMembers = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const members = await (0, workspace_members_service_1.getAllWorkspaceMembers)(workspace_id);
        res.status(200).json(members);
    }
    catch (error) {
        next(error);
    }
};
exports.GetAllWorkspaceMembers = GetAllWorkspaceMembers;
const CreateMember = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const { user_id, role_id } = req.body;
        const member = await (0, workspace_members_service_1.createMember)({ workspace_id, user_id, role_id });
        res.status(201).json(member);
    }
    catch (error) {
        next(error);
    }
};
exports.CreateMember = CreateMember;
const UpdateMember = async (req, res, next) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const workspace_member_id = Number(req.params.member_id);
        const { role_id } = req.body;
        const member = await (0, workspace_members_service_1.updateMember)(workspace_id, workspace_member_id, role_id);
        res.status(200).json(member);
    }
    catch (error) {
        next(error);
    }
};
exports.UpdateMember = UpdateMember;
const DeleteMember = async (req, res, next) => {
    try {
        const workspace_member_id = Number(req.params.member_id);
        const workspace_id = Number(req.params.workspace_id);
        await (0, workspace_members_service_1.deleteMember)(workspace_id, workspace_member_id);
        res.status(204).send;
    }
    catch (error) {
        next(error);
    }
};
exports.DeleteMember = DeleteMember;
