import {prisma} from "../db/prisma"


const findAllProjects = () => {
    return prisma.projects.findMany({
        include:{workspaces: true,
                 issues:{
                    include:{users:true},
                 }
        }
    })
};

const findProjectById = (project_id: number) => {
    
    return prisma.projects.findUnique({
        where:{project_id},
        include:{
            workspaces:true,
            issues:{
                include:{users:true}
            }
        }
    })

};

const findByProjectName = (project_name: string, workspace_id:number) => {
    return prisma.projects.findFirst({
        where:{project_name,workspace_id},
        include:{
            workspaces:true,
            issues:{
                include:{users:true}
            }
            
        }

    })
};

const createProject = (data:{project_name:string; workspace_id:number;}) => {

    return prisma.projects.create({
        data,
        include:{
            workspaces:true,
        }
    })
};

const updateProject = (project_id:number, data:Partial<{project_name:string}>) => {
    return prisma.projects.update(
        {where:{project_id}, data}
    )

};

const deleteProject = (project_id:number) => {
    return prisma.projects.delete({where: {project_id}})
};

export {
    findAllProjects,
    findByProjectName,
    findProjectById,
    createProject,
    updateProject,
    deleteProject,
};