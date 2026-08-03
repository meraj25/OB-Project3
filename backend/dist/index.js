"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const global_error_handling_middleware_1 = __importDefault(require("./middlewares/global-error-handling.middleware"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const workspace_members_route_1 = __importDefault(require("./routes/workspace_members.route"));
const projects_route_1 = __importDefault(require("./routes/projects.route"));
const issues_route_1 = __importDefault(require("./routes/issues.route"));
const workspaces_route_1 = __importDefault(require("./routes/workspaces.route"));
const block_issues_route_1 = __importDefault(require("./routes/block_issues.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use('/api/users', users_route_1.default);
app.use('/api/workspaces', workspace_members_route_1.default);
app.use('/api/projects', projects_route_1.default);
app.use('/api/issues', issues_route_1.default);
app.use('/api/workspaces', workspaces_route_1.default);
app.use('/api/block-issues', block_issues_route_1.default);
app.use(global_error_handling_middleware_1.default);
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
exports.default = app;
