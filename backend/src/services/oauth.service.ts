import {prisma} from "../db/prisma"


const findOrCreateGoogleUser = async (profile: any) => {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;
    const photo = profile.photos?.[0]?.value; 

    if (!email) {
        throw new Error("Google account has no email");
    }

   
    let user = await prisma.users.findFirst({
        where: { auth_provider: "google", provider_id: googleId }
    });
    if (user) return user;

    
    user = await prisma.users.findUnique({ where: { user_email: email } });
    if (user) {
        return prisma.users.update({
            where: { user_id: user.user_id },
            data: { 
                auth_provider: "google", 
                provider_id: googleId,
                email_verified: true,
                profile_picture: user.profile_picture ?? photo,
             }
        });
    }

    
    return prisma.users.create({
        data: {
            user_name: profile.displayName || email.split("@")[0],
            user_email: email,
            user_password: null,
            auth_provider: "google",
            provider_id: googleId,
            profile_picture: photo,
        }
    });
};

export { findOrCreateGoogleUser };