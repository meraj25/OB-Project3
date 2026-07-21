import { prisma } from "../db/prisma"

const createToken = (user_id:number, token_hash:string, expires_at:Date) => {

    return prisma.password_reset_tokens.create({data:{user_id,token_hash,expires_at}})

};

const findByHash = (token_hash:string) => {

    return prisma.password_reset_tokens.findUnique({
        where:{ token_hash }
    })
};

const markUsed =  (token_id:number) => {

    return prisma.password_reset_tokens.update({
        where:{token_id},
        data:{used:true}
    })
};

const invallidateForAllUser  = (user_id:number) => {

    return prisma.password_reset_tokens.updateMany({
        where:{user_id,used:false},
        data:{used:true}
    })

};

export {createToken,findByHash,markUsed,invallidateForAllUser}