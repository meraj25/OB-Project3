import {prisma} from "../db/prisma"

const findAllWorkspaceMembers = () => {

    return prisma.workspace_members.findMany();
};

const findWorkspaceMember = (workspace_member_id:number) => {

    return prisma.workspace_members.findUnique({
        where:{workspace_member_id}
    })

};

const findMembership = (user_id: number, workspace_id: number) => {
    return prisma.workspace_members.findUnique({
        where: { user_id_workspace_id: { user_id, workspace_id } },
        include: { roles: true }
    });
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

const deleteWorkspaceMember = (workspace_member_id:number) => {

    return prisma.workspace_members.delete({
        where:{workspace_member_id}
    })


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
    findByWorkspace
}

