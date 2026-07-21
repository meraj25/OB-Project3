import {prisma} from "../db/prisma"

const createToken = (user_id: number, token_hash: string, expires_at: Date) => {

    return prisma.refresh_tokens.create({data: { user_id, token_hash, expires_at }})

}

const findByHash = (token_hash:string) => {

    return prisma.refresh_tokens.findUnique({
        where: { token_hash }
    })
    
}

const revoke = (token_id:number) => {

    return prisma.refresh_tokens.update({where: { token_id }, data: { revoked: true }})

}

const revokeAllForUser = (user_id: number) => {

    return prisma.refresh_tokens.updateMany({where: { user_id }, data: { revoked: true }})

}

export {createToken,findByHash,revoke,revokeAllForUser}