import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { Api } from "@/lib/api";

export function useRealtimeSync(workspaceId) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!workspaceId) return;

        socket.emit("join_workspace", workspaceId);

        const handleChange = ({ resourceType, action, id, issueId }) => {
            const tagsToInvalidate =
            resourceType === "Comment"
            ? [{ type: "Comment", id: `LIST-${issueId}` }]
            : [{ type: resourceType, id: "LIST" }];
            
            if (id && action !== "create") {
                tagsToInvalidate.push({ type: resourceType, id });
            }
            dispatch(Api.util.invalidateTags(tagsToInvalidate));
        };

        socket.on("resource:changed", handleChange);

        return () => {
            socket.emit("leave_workspace", workspaceId);
            socket.off("resource:changed", handleChange);
        };
    }, [workspaceId, dispatch]);
}