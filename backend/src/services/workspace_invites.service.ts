import crypto from "crypto"
import {prisma} from "../db/prisma"
import { findWorkspaceById } from "../repositories/workspaces.repository"
import { findMembership } from "../repositories/workspace_members"
import { sendWorkspaceInviteEmail } from "../utils/mail"
import ValidationError from "../domain/errors/validation-error"
import NotFoundError from "../domain/errors/not-found-error"
import { emitWorkspaceEvent } from "../sockets/socket"

const createInvite = async (workspace_id: number, user_email: string, role_id: number, invited_by: number) => {
    const workspace = await findWorkspaceById(workspace_id);
    if (!workspace) throw new NotFoundError("Workspace not found");

    if (role_id === 1) throw new ValidationError("Cannot invite as owner");

    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    console.log(user_email, "user_email")

    const invite = await prisma.workspace_invites.create({
        data: { workspace_id, user_email, role_id, token, invited_by, expires_at },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/invites/${token}`;
    await sendWorkspaceInviteEmail(user_email, workspace.workspace_name, inviteLink);

    console.log(inviteLink)

    return invite;
};

const acceptInvite = async (token: string, user_id: number, user_user_email: string) => {
    const invite = await prisma.workspace_invites.findUnique({ where: { token } });

    if (!invite) throw new NotFoundError("Invite not found");
    if (invite.status !== "pending") throw new ValidationError("This invite is no longer valid");
    if (invite.expires_at < new Date()) {
        await prisma.workspace_invites.update({ where: { token }, data: { status: "expired" } });
        throw new ValidationError("This invite has expired");
    }
    if (invite.user_email.toLowerCase() !== user_user_email.toLowerCase()) {
        throw new ValidationError("This invite was sent to a different user_email address");
    }

    const existing = await findMembership(user_id, invite.workspace_id);
    if (existing) {
        await prisma.workspace_invites.update({ where: { token }, data: { status: "accepted" } });
        throw new ValidationError("You are already a member of this workspace");
    }

    const member = await prisma.workspace_members.create({
        data: { workspace_id: invite.workspace_id, user_id, role_id: invite.role_id },
    });

    await prisma.workspace_invites.update({ where: { token }, data: { status: "accepted" } });

    emitWorkspaceEvent(invite.workspace_id, "WorkspaceMember", "create", member.workspace_member_id);

    return member;
};


const getInviteDetails = async (token: string) => {
    const invite = await prisma.workspace_invites.findUnique({
        where: { token },
        include: { workspaces: true, roles: true },
    });

    if (!invite) throw new NotFoundError("Invite not found");

    return {
        workspace_name: invite.workspaces.workspace_name,
        role_name: invite.roles.role_name,
        user_email: invite.user_email,
        status: invite.status,
        expired: invite.expires_at < new Date(),
    };
}; 


const declineInvite = async (token: string, user_email: string) => {
    const invite = await prisma.workspace_invites.findUnique({ where: { token } });

    if (!invite) throw new NotFoundError("Invite not found");
    if (invite.status !== "pending") throw new ValidationError("This invite is no longer pending");
    if (invite.user_email.toLowerCase() !== user_email.toLowerCase()) {
        throw new ValidationError("This invite was sent to a different email address");
    }

    return prisma.workspace_invites.update({ where: { token }, data: { status: "declined" } });
};

export { createInvite, acceptInvite, getInviteDetails,declineInvite };