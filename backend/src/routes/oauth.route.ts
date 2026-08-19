import passport from "../utils/passport"
import { GoogleCallback } from "../controllers/oauth.controller"
import express from "express"

const OauthRouter = express.Router();

OauthRouter
    .route("/google")
    .get((req, res, next) => {
        const state = req.query.redirect ? String(req.query.redirect) : "";
        passport.authenticate("google", {
            scope: ["profile", "email"],
            session: false,
            state,
        })(req, res, next);
    });
OauthRouter
    .route("/google/callback")
    .get(passport.authenticate("google", { session: false, failureRedirect: "/login" }),GoogleCallback)

export default OauthRouter;