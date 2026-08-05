import {prisma} from "../db/prisma"
import { redis } from "../utils/redisClient";


const CACHE_TTL_SECONDS = 30;

const findAllWorkspaceMembers = () => {

    return prisma.workspace_members.findMany();
};

const findWorkspaceMember = (workspace_member_id:number) => {

    return prisma.workspace_members.findUnique({
        where:{workspace_member_id}
    })

};

const findMembership = async (user_id: number, workspace_id: number) => {

    const key = `membership:${user_id}:${workspace_id}`;
    const cached = await redis.get(key);
    if (cached) {
        return JSON.parse(cached);
    }

    const membership = await prisma.workspace_members.findUnique({
        where: { user_id_workspace_id: { user_id, workspace_id } },
        include: { roles: true }
    });

    if (membership) {
        await redis.set(key, JSON.stringify(membership), "EX", CACHE_TTL_SECONDS);
    }

    return membership;
};

const invalidateMembership = async (user_id: number, workspace_id: number) => {
    await redis.del(`membership:${user_id}:${workspace_id}`);
};

const createWorkspaceMember = (data:{workspace_id:number,user_id:number,role_id:number}) => {

    return prisma.workspace_members.create({data})

};

const updateWorkspaceMember = (workspace_member_id:number, data: Partial<{role_id:number}>) => {

    return prisma.workspace_members.update({
        where:{workspace_member_id},
        data
    })

}

const deleteWorkspaceMember = async (workspace_member_id:number) => {

    const member = await prisma.workspace_members.findUnique({
        where: { workspace_member_id }
    });
    if (!member) {
        return null; 
    }

    const deleted = await prisma.workspace_members.delete({
        where: { workspace_member_id }
    });

    await invalidateMembership(member.user_id, member.workspace_id);

    return deleted;


};

const findByWorkspace = (workspace_id:number) => {

     return prisma.workspace_members.findMany({
        where: { workspace_id },
        include: {
            users: true,
            roles: true
        }
    });

}

export {
    findAllWorkspaceMembers,
    findWorkspaceMember,
    createWorkspaceMember,
    findMembership,
    updateWorkspaceMember,
    deleteWorkspaceMember,
    findByWorkspace,
    invalidateMembership
}

