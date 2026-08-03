"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIssueWithPeople = exports.findIssueSubtree = exports.deleteIssue = exports.updateIssue = exports.createIssue = exports.findIssueByName = exports.findIssueById = exports.findAllIssues = void 0;
const prisma_1 = require("../db/prisma");
const findAllIssues = async (filters) => {
    const { project_id, status, assignee, reporter, priority, labels, page, limit, search, sortBy, sortOrder } = filters;
    const where = {
        project_id,
        ...(status && { issue_status: status }),
        ...(reporter && { issue_reporter: reporter }),
        ...(priority && { issue_priority: priority }),
        ...(assignee && { issue_assignees: { some: { user_id: assignee } } }),
        ...(labels?.length && { issue_labels: { some: { label_id: { in: labels } } } }),
        ...(search && {
            OR: [
                { issue_name: { contains: search, mode: "insensitive" } },
                { issue_description: { contains: search, mode: "insensitive" } },
            ]
        })
    };
    const [issues, totalCount] = await Promise.all([
        prisma_1.prisma.issues.findMany({
            where,
            include: {
                issue_assignees: { include: { users: true } },
                issue_labels: { include: { labels: true } },
                users: true,
                issues: true,
                projects: { include: { workspaces: true } },
                block_issues_block_issues_blocking_issue_idToissues: true,
                block_issues_block_issues_blocked_issue_idToissues: true
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy ?? "issue_id"]: sortOrder ?? "desc" },
        }),
        prisma_1.prisma.issues.count({ where })
    ]);
    return { issues, totalCount };
};
exports.findAllIssues = findAllIssues;
const findIssueById = (issue_id) => {
    return prisma_1.prisma.issues.findUnique({
        where: { issue_id },
        include: {
            projects: {
                include: { workspaces: true }
            },
            users: true,
            issue_assignees: { include: { users: true } },
            issue_comments_chain: true,
            issue_labels: { include: { labels: true } }
        }
    });
};
exports.findIssueById = findIssueById;
const findIssueByName = (issue_name) => {
    return prisma_1.prisma.issues.findMany({
        where: { issue_name },
        include: {
            projects: {
                include: { workspaces: true }
            },
            users: true,
            issue_assignees: { include: { users: true } },
            issue_comments_chain: true,
            issue_labels: { include: { labels: true } }
        }
    });
};
exports.findIssueByName = findIssueByName;
const createIssue = (data) => {
    const { assignee_ids, ...issueData } = data;
    return prisma_1.prisma.issues.create({
        data: { ...issueData,
            issue_assignees: assignee_ids?.length ?
                {
                    create: assignee_ids.map((user_id) => ({ user_id }))
                } : undefined,
        },
        include: {
            users: true,
            projects: { include: { workspaces: true } },
            issue_assignees: { include: { users: true } },
        },
    });
};
exports.createIssue = createIssue;
const updateIssue = (issue_id, data) => {
    return prisma_1.prisma.issues.update({
        where: { issue_id },
        data
    });
};
exports.updateIssue = updateIssue;
const deleteIssue = (issue_id) => {
    return prisma_1.prisma.issues.delete({
        where: { issue_id }
    });
};
exports.deleteIssue = deleteIssue;
const findIssueSubtree = async (issue_id) => {
    return prisma_1.prisma.$queryRaw `
        WITH RECURSIVE issue_tree AS (
            SELECT issue_id, issue_name, parent_issue_id, 0 AS depth
            FROM issues
            WHERE issue_id = ${issue_id}

            UNION ALL

            SELECT i.issue_id, i.issue_name, i.parent_issue_id, it.depth + 1
            FROM issues i
            INNER JOIN issue_tree it ON i.parent_issue_id = it.issue_id
        )
        SELECT * FROM issue_tree ORDER BY depth;
    `;
};
exports.findIssueSubtree = findIssueSubtree;
const findIssueWithPeople = (issue_id) => {
    return prisma_1.prisma.issues.findUnique({
        where: { issue_id },
        include: {
            users: true,
            issue_assignees: { include: { users: true } },
        }
    });
};
exports.findIssueWithPeople = findIssueWithPeople;
