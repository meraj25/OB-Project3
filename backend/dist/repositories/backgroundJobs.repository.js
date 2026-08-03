"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markJobFailed = exports.markJobDone = exports.getPendingJobs = exports.enqueueJob = void 0;
const prisma_1 = require("../db/prisma");
const enqueueJob = (job_type, payload) => {
    return prisma_1.prisma.background_jobs.create({
        data: { job_type, payload, status: "pending" }
    });
};
exports.enqueueJob = enqueueJob;
const getPendingJobs = () => {
    return prisma_1.prisma.background_jobs.findMany({ where: { status: "pending" }, take: 10 });
};
exports.getPendingJobs = getPendingJobs;
const markJobDone = (job_id) => {
    return prisma_1.prisma.background_jobs.update({ where: { job_id }, data: { status: "done" } });
};
exports.markJobDone = markJobDone;
const markJobFailed = (job_id, attempts) => {
    return prisma_1.prisma.background_jobs.update({ where: { job_id }, data: { status: "failed", attempts } });
};
exports.markJobFailed = markJobFailed;
