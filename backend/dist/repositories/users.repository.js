"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.findUserByName = exports.findUserById = exports.findUserByEmail = exports.findAllUsers = void 0;
const prisma_1 = require("../db/prisma");
const findAllUsers = () => {
    return prisma_1.prisma.users.findMany();
};
exports.findAllUsers = findAllUsers;
const findUserById = (user_id) => {
    return prisma_1.prisma.users.findUnique({
        where: { user_id }
    });
};
exports.findUserById = findUserById;
const findUserByEmail = (user_email) => {
    return prisma_1.prisma.users.findUnique({
        where: { user_email }
    });
};
exports.findUserByEmail = findUserByEmail;
const findUserByName = (user_name) => {
    return prisma_1.prisma.users.findMany({
        where: { user_name }
    });
};
exports.findUserByName = findUserByName;
const createUser = (data) => {
    return prisma_1.prisma.users.create({ data });
};
exports.createUser = createUser;
const updateUser = (user_id, data) => {
    return prisma_1.prisma.users.update({ where: { user_id }, data });
};
exports.updateUser = updateUser;
const deleteUser = (user_id) => {
    return prisma_1.prisma.users.delete({
        where: { user_id }
    });
};
exports.deleteUser = deleteUser;
