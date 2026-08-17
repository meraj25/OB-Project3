import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT),
    secure:false,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

});

export async function sendWorkspaceInviteEmail(to: string, workspace_name: string, inviteLink: string) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: `You've been invited to join ${workspace_name}`,
        html: `
            <p>You've been invited to join <strong>${workspace_name}</strong>.</p>
            <p><a href="${inviteLink}">Click here to accept the invite</a></p>
            <p>This link expires in 7 days.</p>
        `,
    });

}