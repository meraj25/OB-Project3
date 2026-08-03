"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = async (to, subject, html) => {
    const { data, error } = await resend.emails.send({
        from: "Your App <onboarding@resend.dev>",
        to,
        subject,
        html,
    });
    if (error) {
        throw new Error(`Resend failed: ${error.message}`);
    }
    return data;
};
exports.sendEmail = sendEmail;
