import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../services/oauth.service";


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await findOrCreateGoogleUser(profile);
                done(null, user);
            } catch (error) {
                done(error as Error, undefined);
            }
        }
    )
);

export default passport;