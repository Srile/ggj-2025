import * as Bun from "bun"
import { Message } from "./protocol.js";
import Game from "./src-game/game.js";
import { render } from "./src-game/websocket_renderer.js";

// https://render.com/docs/web-services#port-binding
const PORT = process.env.PORT || 1000;

const ROOMS = {
    "1337": []
}

const GAME = new Game()
GAME.init()

const server = Bun.serve<{ authToken: string; }>({
    port: PORT,
    fetch(req, server) {
        server.upgrade(req, {
            data: {
                "clientId": crypto.randomUUID()
            },
        });
    },
    websocket: {
        async close(ws, code, message) {
            ROOMS["1337"] = ROOMS["1337"].filter(socket => socket !== ws)
        },
        async message(ws, message) {
            let parsedMsg: Message;
            try {
                parsedMsg = JSON.parse(String(message)) as Message
            } catch (e) {
                console.warn("Received invalid message: %s", message);
                ws.send(JSON.stringify(
                    {
                        command: "SERVER_ERROR",
                        message: `Invalid protocol. Closing connection.`
                    }
                ))
                ws.close()
                return
            }

            switch (parsedMsg.command) {
                case "CONNECT":
                    ROOMS[parsedMsg.roomId].push(ws)
                    break
                case "DISCONNECT":
                    ROOMS["1337"] = ROOMS["1337"].filter(socket => socket !== ws)
                    ws.close()
                    break
                default:
                    ws.send(JSON.stringify(
                        {
                            command: "SERVER_ERROR",
                            message: `Unknown command ${parsedMsg.command}`
                        }
                    ))
                    ws.close()
            }
        },
    },
});

console.log(`Listening on localhost:${server.port}`);

async function updateServer() {
    const state = GAME.update({})
    const response = render(state)

    for (const ws of ROOMS["1337"]) {
        sendUpdateGameState(ws, response)
    }
    console.log("Connected clients: %s", ROOMS["1337"].length)
}
async function sendUpdateGameState(ws, responseObj) {
    ws.send(JSON.stringify(responseObj))
}

setInterval(updateServer, 1000);

