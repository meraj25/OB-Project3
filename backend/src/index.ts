import app from "./app";
import http from "http";
import {initSocket} from "./sockets/socket"

const PORT = 8000;

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});

