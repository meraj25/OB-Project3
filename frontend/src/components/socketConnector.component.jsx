import { useEffect } from "react";
import { useGetUserQuery } from "@/lib/api";
import { socket } from "@/lib/socket";

function SocketConnector({ children }) {
    const { data: { user } = {} } = useGetUserQuery();
    const validUser = Boolean(user);

    useEffect(() => {
        if (validUser && !socket.connected) {
            socket.connect();
        }
    }, [validUser]);

    return children;
}

export default SocketConnector;