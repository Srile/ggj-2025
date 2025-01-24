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
            console.log("ParsedMsg: %o", parsedMsg);
            switch (parsedMsg.command) {
                case "CONNECT":
                    ROOMS["1337"].push(ws)
                    break
                case "DISCONNECT":
                    ROOMS["1337"] = ROOMS["1337"].filter(socket => socket !== ws)
                    break
                default:
                    ws.send(JSON.stringify(
                        {
                            command: "SERVER_ERROR",
                            message: `Unknown command ${parsedMsg.command}`
                        }
                    ))
                    break
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

setInterval(updateServer, 1000);

