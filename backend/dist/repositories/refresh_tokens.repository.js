"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeAllForUser = exports.revoke = exports.findByHash = exports.createToken = void 0;
const prisma_1 = require("../db/prisma");
const createToken = (user_id, token_hash, expires_at) => {
    return prisma_1.prisma.refresh_tokens.create({ data: { user_id, token_hash, expires_at } });
};
exports.createToken = createToken;
const findByHash = (token_hash) => {
    return prisma_1.prisma.refresh_tokens.findUnique({
        where: { token_hash }
    });
};
exports.findByHash = findByHash;
const revoke = (token_id) => {
    return prisma_1.prisma.refresh_tokens.update({ where: { token_id }, data: { revoked: true } });
};
exports.revoke = revoke;
const revokeAllForUser = (user_id) => {
    return prisma_1.prisma.refresh_tokens.updateMany({ where: { user_id }, data: { revoked: true } });
};
exports.revokeAllForUser = revokeAllForUser;
