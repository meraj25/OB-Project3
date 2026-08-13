import {Server as HttpServer} from "http"
import {Server as SocketIOServer, Socket} from "socket.io"
import {parseCookie} from "cookie"
import jwt from "jsonwebtoken"
import { findMembership } from "../repositories/workspace_members"

let io:SocketIOServer;

export function initSocket(httpServer: HttpServer) {
     console.log("initSocket called — setting up Socket.IO server");
    io = new SocketIOServer(httpServer, {
        cors: { origin: "http://localhost:5173", credentials: true },
    });

    io.use((socket, next) => {
        try {
            const rawCookies = socket.handshake.headers.cookie ?? "";
            console.log("socket handshake cookies:", rawCookies);
            const parsed = parseCookie(rawCookies);
            const token = parsed["access-Token"];
            console.log("extracted token:", token ? "present" : "MISSING");

            if (!token) return next(new Error("Unauthorized"));

            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { user_id: number };
            socket.data.user_id = payload.user_id;
            console.log("socket auth SUCCESS for user", payload.user_id);
            next();
        } catch(err) {
            console.log("socket auth FAILED:", err);
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket: Socket) => {
        socket.join(`user:${socket.data.user_id}`);

        socket.on("join_workspace", async (workspaceId: number) => {
            const membership = await findMembership(socket.data.user_id, workspaceId);
            if (!membership) {
                socket.emit("join_workspace_error", { workspaceId, message: "Not a member of this workspace" });
                return;
            }
            socket.join(`workspace:${workspaceId}`);
        });

        socket.on("leave_workspace", (workspaceId: number) => {
            socket.leave(`workspace:${workspaceId}`);
        });
    });
}

type ResourceType = "Workspace" | "Project" | "Issue" | "WorkspaceMember" | "Comment" | "BlockedIssue";
type Action = "create" | "update" | "delete";

export function emitWorkspaceEvent(
    workspaceId: number,
    resourceType: ResourceType,
    action: Action,
    id?: number | string,
    issueId?: number
) {
    if (!io) return;
    io.to(`workspace:${workspaceId}`).emit("resource:changed", { resourceType, action, id, workspaceId,issueId });
}

export function emitUserEvent(
    userId: number,
    resourceType: ResourceType,
    action: Action,
    id?: number | string
) {
    if (!io) return;
    io.to(`user:${userId}`).emit("resource:changed", { resourceType, action, id });
}