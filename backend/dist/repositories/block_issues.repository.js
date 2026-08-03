"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wouldCreateCycle = exports.deleteBlockedIssueId = exports.createBlockedIssueById = exports.findBlockedIssueById = exports.findAllBlockedIssues = void 0;
const prisma_1 = require("../db/prisma");
const findAllBlockedIssues = () => {
    return prisma_1.prisma.block_issues.findMany();
};
exports.findAllBlockedIssues = findAllBlockedIssues;
const findBlockedIssueById = (blocked_issue_id, blocking_issue_id) => {
    return prisma_1.prisma.block_issues.findUnique({
        where: {
            blocked_issue_id_blocking_issue_id: {
                blocked_issue_id,
                blocking_issue_id
            }
        },
        include: {
            issues_block_issues_blocked_issue_idToissues: { include: { users: true } },
            issues_block_issues_blocking_issue_idToissues: { include: { users: true } }
        }
    });
};
exports.findBlockedIssueById = findBlockedIssueById;
const createBlockedIssueById = (data) => {
    return prisma_1.prisma.block_issues.create({
        data,
        include: {
            issues_block_issues_blocked_issue_idToissues: { include: { users: true } },
            issues_block_issues_blocking_issue_idToissues: { include: { users: true } }
        }
    });
};
exports.createBlockedIssueById = createBlockedIssueById;
const deleteBlockedIssueId = (blocked_issue_id, blocking_issue_id) => {
    return prisma_1.prisma.block_issues.delete({
        where: {
            blocked_issue_id_blocking_issue_id: { blocked_issue_id, blocking_issue_id }
        }
    });
};
exports.deleteBlockedIssueId = deleteBlockedIssueId;
const wouldCreateCycle = async (blocking_issue_id, blocked_issue_id) => {
    const result = await prisma_1.prisma.$queryRaw `
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
exports.wouldCreateCycle = wouldCreateCycle;
