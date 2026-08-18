import {prisma} from "../db/prisma"
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";


const verifyEmail = async (token: string) => {
    const record = await prisma.verification_tokens.findUnique({ where: { token } });

    if (!record) throw new NotFoundError("Invalid verification link");
    if (record.expires_at < new Date()) {
        await prisma.verification_tokens.delete({ where: { token } });
        throw new ValidationError("Verification link has expired");
    }

    await prisma.users.update({
        where: { user_id: record.user_id },
        data: { email_verified: true },
    });

    await prisma.verification_tokens.delete({ where: { token } });

    return { message: "Email verified" };
};

export default verifyEmail;