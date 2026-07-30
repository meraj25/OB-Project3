import {prisma} from "../db/prisma"

const enqueueJob = (job_type: string, payload: object) => {
    return prisma.background_jobs.create({
        data: { job_type, payload, status: "pending" }
    });
};

const getPendingJobs = () => {
    return prisma.background_jobs.findMany({ where: { status: "pending" }, take: 10 });
};

const markJobDone = (job_id: number) => {
    return prisma.background_jobs.update({ where: { job_id }, data: { status: "done" } });
};

const markJobFailed = (job_id: number, attempts: number) => {
    return prisma.background_jobs.update({ where: { job_id }, data: { status: "failed", attempts } });
};

export { enqueueJob, getPendingJobs, markJobDone, markJobFailed };