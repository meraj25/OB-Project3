import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
    withCredentials: true, 
    autoConnect: false,
});

if (typeof window !== "undefined") {
    window.__socket = socket;
}