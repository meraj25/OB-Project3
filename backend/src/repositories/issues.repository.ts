import { Prisma } from '../generated/prisma/client';
import { prisma } from '../db/prisma'



const findAllIssues = async (filters:{
project_id:number
status?:string,
assignee?:number,
reporter?:number,
priority?:string,
labels?:number[],
page:number,
limit:number,
search:string,
sortBy?: string,
sortOrder?: "asc" | "desc",

}) => {

    const {project_id,status,assignee,reporter,priority,labels,page,limit,search,sortBy,sortOrder} = filters;

    const where: Prisma.issuesWhereInput = {
        project_id,
        ...(status && {issue_status:status}),
        ...(reporter && {issue_reporter:reporter}),
        ...(priority && {issue_priority:priority}),
        ...(assignee && {issue_assignees:{some:{user_id:assignee}}}),
        ...(labels?.length && {issue_labels:{some:{label_id: {in: labels}}}})
        ...(search && {
            OR:[
                {issue_name:{contains:search, mode:"insensitive"}},
                {issue_description:{contains:search,mode:"insensitive"}},
            ]
        })
    } 

    const [issues, totalCount] = await Promise.all([
        prisma.issues.findMany({
            where,
            include:{
                issue_assignees: {include:{users:true}},
                issue_labels:{include:{labels:true}},
                users:true,
                issues:true,
                projects:{include:{workspaces:true}},
                block_issues_block_issues_blocking_issue_idToissues:true,
                block_issues_block_issues_blocked_issue_idToissues:true

            },

            skip:(page-1) * limit,
            take:limit,
            orderBy:{[sortBy ?? "issue_id"]: sortOrder ?? "desc"},
        }),

        prisma.issues.count({where})
    ]);

    return {issues, totalCount};



    
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
    return prisma.issues.findMany({
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
    issue_description?:string; 
    issue_reporter:number; 
    issue_priority:string;
    issue_status:string;
    project_id:number;
    assignee_ids?:number[]

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
        projects:{include:{workspaces:true}},
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

