import { prisma } from "../db/prisma"


const findAllWorkspaces = () => {
    return prisma.workspaces.findMany();

};

const findWorkspaceById = (workspace_id: number) => {
    return prisma.workspaces.findUnique({
        where: {workspace_id}
    })
};

const findWorkspaceByName = (workspace_name:string) => {
    return prisma.workspaces.findUnique({
        where: {workspace_name}
    })
};


const createWorkspace = (data: {workspace_name: string;}) => {
    return prisma.workspaces.create({data})
    
};

const updateWorkspace = (workspace_id: number, data: Partial<{workspace_name: string}>) => {
    return prisma.workspaces.update({where: {workspace_id},data})

};

const deleteWorkspace = (workspace_id: number) => {

    return prisma.workspaces.delete({where:{workspace_id}})

};

export {
    findAllWorkspaces,
    findWorkspaceById,
    findWorkspaceByName,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace
}