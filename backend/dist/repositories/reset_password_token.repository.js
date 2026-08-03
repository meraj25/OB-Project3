"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invallidateForAllUser = exports.markUsed = exports.findByHash = exports.createToken = void 0;
const prisma_1 = require("../db/prisma");
const createToken = (user_id, token_hash, expires_at) => {
    return prisma_1.prisma.password_reset_tokens.create({ data: { user_id, token_hash, expires_at } });
};
exports.createToken = createToken;
const findByHash = (token_hash) => {
    return prisma_1.prisma.password_reset_tokens.findUnique({
        where: { token_hash }
    });
};
exports.findByHash = findByHash;
const markUsed = (token_id) => {
    return prisma_1.prisma.password_reset_tokens.update({
        where: { token_id },
        data: { used: true }
    });
};
exports.markUsed = markUsed;
const invallidateForAllUser = (user_id) => {
    return prisma_1.prisma.password_reset_tokens.updateMany({
        where: { user_id, used: false },
        data: { used: true }
    });
};
exports.invallidateForAllUser = invallidateForAllUser;
