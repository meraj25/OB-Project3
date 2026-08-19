import express from "express";
import cors from "cors"
import {} from "./db/prisma"
import helmet from "helmet";
import cookieParser from "cookie-parser";
import globalErrorHandlingMiddleware from "./middlewares/global-error-handling.middleware";
import UserRouter from "./routes/users.route";
import Workspace_MembersRouter from "./routes/workspace_members.route";
import ProjectRouter from "./routes/projects.route";
import IssueRouter from "./routes/issues.route";
import WorkspaceRouter from "./routes/workspaces.route";
import Block_issuesRouter from "./routes/block_issues.route";
import OauthRouter from "./routes/oauth.route";
import passport from "./utils/passport"




const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))

app.use(cors({origin:"http://localhost:5173",  credentials: true}));

app.use(cookieParser());

app.use(helmet());

app.use(passport.initialize());

app.use('/api/users',UserRouter);
app.use('/api/workspaces',WorkspaceRouter);
app.use('/api/projects', ProjectRouter);
app.use('/api/issues', IssueRouter);
app.use('/api/workspace_members', Workspace_MembersRouter);
app.use('/api/block-issues',Block_issuesRouter);
app.use('/api/auth',OauthRouter);

app.use(globalErrorHandlingMiddleware);


export default app;