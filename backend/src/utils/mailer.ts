import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async (to: string, subject: string, html: string) => {
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

export {sendEmail}; 