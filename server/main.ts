import * as Bun from "bun"
import { Message } from "./protocol.js";
import Game from "./src-game/game.js";
import { render } from "./src-game/websocket_renderer.js";
import { State } from "./src-game/state.js";

// https://render.com/docs/web-services#port-binding
const PORT = process.env.PORT || 10000;

const WEBSOCKETS = {} // ClientId to WS
const ROOMS = {
    "1337": []
}

let ACTION_QUEUE = []
const GAME = new Game()
GAME.init()

const server = Bun.serve<{ clientId: string; }>({
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
            console.log("Close %s", ws.data.clientId)
            delete WEBSOCKETS[ws.data.clientId]
            GAME.removePlayer(ws.data.clientId)
        },
        async open(ws) {
            console.log("Open %s", ws.data.clientId)
            WEBSOCKETS[ws.data.clientId] = ws
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
                    ROOMS[parsedMsg.roomId].push(ws.data.clientId)
                    const state = GAME.addPlayer(ws.data.clientId)
                    if (!!state) {
                        sendUpdatedGameState(ws, state)
                    } else {
                        ws.send(JSON.stringify(
                            {
                                command: "SERVER_ERROR",
                                message: `Room ${parsedMsg.roomId} full!`
                            }
                        ))
                    }

                    break
                case "DISCONNECT":
                    for (const roomId of Object.keys(ROOMS)) {
                        ROOMS[roomId] = ROOMS[roomId].filter(clientId => clientId !== ws.data.clientId)
                    }
                    ws.close()
                    break
                case "ACTION":
                    const clientId: string = ws.data.clientId
                    const actionObj = {}
                    actionObj[clientId] = parsedMsg.action
                    ACTION_QUEUE.push(actionObj)
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
    console.log("Connected clients: %s", Object.keys(WEBSOCKETS).length)

    const state = GAME.update(ACTION_QUEUE)
    ACTION_QUEUE = []

    for (const clientId of ROOMS["1337"]) {
        const ws = WEBSOCKETS[clientId]
        if (!!ws) {
            sendUpdatedGameState(ws, state)
        }
    }

}
async function sendUpdatedGameState(ws, state: State) {
    const response = render(state, ws.data.clientId)
    ws.send(JSON.stringify(response))
}

setInterval(updateServer, 1000);

