import { Prisma } from '../generated/prisma/client';
import { prisma } from '../db/prisma'


const findAllIssues = () => {
    return prisma.issues.findMany({
        include:{
            projects:{
                include:{workspaces:true}
            },
            users:true,
            issue_assignees:{include:{users:true}},
            issue_comments_chain:true,
            issue_labels:{include:{labels:true}}
        }
    })
    
} ;

const findIssueById = (issue_id: number) => {
    return prisma.issues.findUnique({
        where: {issue_id},
        include:{
            projects:{
                include:{workspaces:true}
            },
            users:true,
            issue_assignees:{include:{users:true}},
            issue_comments_chain:true,
            issue_labels:{include:{labels:true}}
        }
    })
};

const findIssueByName = (issue_name: string) => {
    return prisma.issues.findFirst({
        where: {issue_name},
        include:{
            projects:{
                include:{workspaces:true}
            },
            users:true,
            issue_assignees:{include:{users:true}},
            issue_comments_chain:true,
            issue_labels:{include:{labels:true}}
        }
    })
};

const createIssue = (data:{
    issue_name: string;
    issue_description:string; 
    issue_reporter:number; 
    issue_priority:string;
    issue_status:string;
    project_id:number;
    assignee_ids:number[]

     }) => {

        const {assignee_ids, ...issueData} = data

    return prisma.issues.create({
        data:{...issueData,
            issue_assignees:assignee_ids?.length?
            {
                create: assignee_ids.map((user_id) => ({user_id}))
            }: undefined,
        },
        include: {
        users: true,
        issue_assignees: { include: { users: true } },
    },

    })
};


const updateIssue = (issue_id : number, data: Partial<{
    issue_name: string; 
    issue_description:string;
    issue_priority:string;
    issue_status:string;
}>) => {

    return prisma.issues.update({
        where:{issue_id},
        data
    })


};

const deleteIssue = (issue_id:number) => {

    return prisma.issues.delete({
        where:{issue_id}
    })

};

export {
    findAllIssues,
    findIssueById,
    findIssueByName,
    createIssue,
    updateIssue,
    deleteIssue
} 

