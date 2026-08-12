
import {prisma} from "../db/prisma";

const findChainByIssueId = (issue_id: number) => {

    return prisma.issue_comments_chain.findUnique({

        where:{issue_id},
    })

};


const createChainForIssue = (issue_id: number) => {

    return prisma.issue_comments_chain.create({
        data:{issue_id}
    })

};

const findCommentsByChainId = (chain_id:number) => {

    return prisma.issue_comments.findMany({

        where:{chain_id},
        include:{users:true},
        orderBy:{created_at:"asc"}
    })
};

const createComment = (data:{chain_id:number, user_id:number, comment:string}) => {

    return prisma.issue_comments.create({
        data,
        include:{users:true}
    })
};

const deleteComment = (comment_id: number) => {

    return prisma.issue_comments.delete({

        where:{comment_id}

    })
};

export {
    findChainByIssueId,
    findCommentsByChainId,
    createChainForIssue,
    createComment,
    deleteComment}