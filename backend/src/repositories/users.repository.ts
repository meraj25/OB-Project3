import { prisma } from "../db/prisma"

const findAllUsers = () => {    
    return prisma.users.findMany();
};

const findUserById = (user_id : number) => {
    return prisma.users.findUnique({
        where:{ user_id}
    })
};

const findUserByEmail = (user_email:string) => {
    return prisma.users.findUnique({
        where:{ user_email }
    })
};

const findUserByName = (user_name:string) => {
    return prisma.users.findMany({
        where:{ user_name }
    })
};

const createUser = (data: {user_email:string; user_name:string; user_password: string;}) => {

    return prisma.users.create({data})


}

const updateUser = (user_id: number , data:Partial<{user_name: string; user_email: string; user_password: string;}>) => {
    return prisma.users.update({where: {user_id},data})

};


const deleteUser = (user_id:number) => {
    return prisma.users.delete({
        where: {user_id}
    })
};


export {
    findAllUsers,
    findUserByEmail,
    findUserById,
    findUserByName,
    createUser,
    updateUser,
    deleteUser
}