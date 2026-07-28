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

};

const wouldCreateCycle = async (blocking_issue_id: number, blocked_issue_id: number): Promise<boolean> => {
    const result = await prisma.$queryRaw<{ would_create_cycle: boolean }[]>`
        WITH RECURSIVE reachable AS (
            SELECT blocking_issue_id, blocked_issue_id
            FROM block_issues
            WHERE blocking_issue_id = ${blocked_issue_id}

            UNION ALL

            SELECT bi.blocking_issue_id, bi.blocked_issue_id
            FROM block_issues bi
            INNER JOIN reachable r ON bi.blocking_issue_id = r.blocked_issue_id
        )
        SELECT EXISTS (
            SELECT 1 FROM reachable WHERE blocked_issue_id = ${blocking_issue_id}
        ) AS would_create_cycle;
    `;
    return result[0].would_create_cycle;
};


export {
    findAllBlockedIssues,
    findBlockedIssueById,
    createBlockedIssueById,
    deleteBlockedIssueId,
    wouldCreateCycle
}