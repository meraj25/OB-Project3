import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { Api } from "@/lib/api";

export function useUserRealtimeSync() {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleChange = ({ resourceType, action, id }) => {
            const tagsToInvalidate = [{ type: resourceType, id: "LIST" }];
            if (id && action !== "create") {
                tagsToInvalidate.push({ type: resourceType, id });
            }
            dispatch(Api.util.invalidateTags(tagsToInvalidate));
        };

        socket.on("resource:changed", handleChange);
        return () => socket.off("resource:changed", handleChange);
    }, [dispatch]);
}