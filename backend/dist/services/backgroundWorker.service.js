"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backgroundJobs_repository_1 = require("../repositories/backgroundJobs.repository");
const mailer_1 = require("../utils/mailer");
const processJobs = async () => {
    const jobs = await (0, backgroundJobs_repository_1.getPendingJobs)();
    for (const job of jobs) {
        try {
            const payload = job.payload;
            if (job.job_type === "issue_assigned_email") {
                for (const email of payload.recipients) {
                    await (0, mailer_1.sendEmail)(email, `You were assigned to: ${payload.issue_name}`, `<p>You've been assigned to issue "<strong>${payload.issue_name}</strong>".</p>`);
                }
            }
            if (job.job_type === "issue_updated_email") {
                for (const email of payload.recipients) {
                    await (0, mailer_1.sendEmail)(email, `Issue updated: ${payload.issue_name}`, `<p>Issue "<strong>${payload.issue_name}</strong>" was updated.</p>
                         <p>Changes: ${JSON.stringify(payload.changes)}</p>`);
                }
            }
            if (job.job_type === "issue_deleted_email") {
                for (const email of payload.recipients) {
                    await (0, mailer_1.sendEmail)(email, `Issue deleted: ${payload.issue_name}`, `<p>Issue "<strong>${payload.issue_name}</strong>" has been deleted.</p>`);
                }
            }
            await (0, backgroundJobs_repository_1.markJobDone)(job.job_id);
        }
        catch (error) {
            console.error(`Job ${job.job_id} failed:`, error);
            await (0, backgroundJobs_repository_1.markJobFailed)(job.job_id, job.attempts + 1);
        }
    }
};
const runWorkerLoop = async () => {
    while (true) {
        try {
            await processJobs();
        }
        catch (error) {
            console.error("Worker loop error:", error);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
};
setInterval(runWorkerLoop, 5000);
console.log("Worker started, polling for jobs...");
