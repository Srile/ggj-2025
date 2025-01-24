import * as Bun from "bun"
import { Command, Message } from "./protocol.js";

// https://render.com/docs/web-services#port-binding
const PORT = process.env.PORT || 1000;

const ROOMS = {
    "1337": []
}

const server = Bun.serve<{ authToken: string; }>({
    port: PORT,
    fetch(req, server) {
        server.upgrade(req, {
            data: "foobar",
        });
    },
    websocket: {
        async message(ws, message) {
            const parsedMsg: Message = JSON.parse(String(message))
            console.log(`${parsedMsg.command}`);
            ws.send("Received!");
            switch (parsedMsg.command) {
                case Command.CONNECT:
                    ROOMS["1337"].push(ws)
                case Command.DISCONNECT:
                    ROOMS["1337"] = ROOMS["1337"].filter(socket => socket !== ws)
                default:
                    ws.send(JSON.stringify(
                        {
                            command: "SERVER_ERROR",
                            message: "Unknown command"
                        }
                    ))
            }
        },
    },
});

console.log(`Listening on localhost:${server.port}`);

async function updateServer() {
    for (const ws of ROOMS["1337"]) {
        sendUpdateGameState(ws)
    }
    console.log("Connected clients: %o", ROOMS)
}
async function sendUpdateGameState(ws) {
    ws.send("New game state")
}

setInterval(updateServer, 500);

