import { prisma } from '../db/prisma'


const findAllBlockedIssues = () => {

    return prisma.block_issues.findMany();
};

const findBlockedIssueById = (blocked_issue_id:number, blocking_issue_id: number) => {

    return prisma.block_issues.findUnique({
        where:{
            blocked_issue_id_blocking_issue_id:{
                blocked_issue_id,
                blocking_issue_id
            }
        },

        include:{
            issues_block_issues_blocked_issue_idToissues: {include: {users:true}},
            issues_block_issues_blocking_issue_idToissues:{include: {users:true}}
        }
        
    }) 

};

const createBlockedIssueById = (data:{blocked_issue_id:number , blocking_issue_id: number}) => {

    return prisma.block_issues.create({
        data,
        include:{
            issues_block_issues_blocked_issue_idToissues: {include: {users:true}},
            issues_block_issues_blocking_issue_idToissues:{include: {users:true}}
        }
    })
    
};

const deleteBlockedIssueId = (blocked_issue_id:number, blocking_issue_id:number) => {

    return prisma.block_issues.delete({
        where:{
            blocked_issue_id_blocking_issue_id:{blocked_issue_id,blocking_issue_id}}
    })

}

export {
    findAllBlockedIssues,
    findBlockedIssueById,
    createBlockedIssueById,
    deleteBlockedIssueId
}