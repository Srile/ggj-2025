import * as Bun from "bun"
import { Message } from "./protocol.js";
import Game, { ClientIdWithAction } from "./src-game/game.js";
import { render } from "./src-game/websocket_renderer.js";
import { State } from "./src-game/state.js";

// https://render.com/docs/web-services#port-binding
const PORT = process.env.PORT || 10000;

const WEBSOCKETS = {} // ClientId to WS
const ROOMS2GAME = {}
const CLIENTS2ROOM = {}

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
            if (Object.hasOwn(CLIENTS2ROOM, ws.data.clientId)) {
                const game = ROOMS2GAME[CLIENTS2ROOM[ws.data.clientId]]
                game.removePlayer(ws.data.clientId)
                delete CLIENTS2ROOM[ws.data.clientId]
                if (!!!game.getClientIds().length) {
                    const roomId = game.roomId
                    ROOMS2GAME[roomId] = undefined
                    delete ROOMS2GAME[roomId]
                }
            }
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
                    //ROOMS[parsedMsg.roomId].push(ws.data.clientId)
                    CLIENTS2ROOM[ws.data.clientId] = parsedMsg.roomId
                    let game: Game;
                    if (Object.hasOwn(ROOMS2GAME, parsedMsg.roomId)) {
                        game = ROOMS2GAME[parsedMsg.roomId]
                    } else {
                        ROOMS2GAME[parsedMsg.roomId] = new Game(parsedMsg.roomId)
                        game = ROOMS2GAME[parsedMsg.roomId]
                        game.init()
                    }
                    const state = game.addPlayer(ws.data.clientId)
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
                    ws.close()
                    break
                case "ACTION":
                    if (Object.hasOwn(CLIENTS2ROOM, ws.data.clientId)) {
                        const roomId = CLIENTS2ROOM[ws.data.clientId]
                        const game: Game = ROOMS2GAME[roomId]
                        game.addAction({
                            clientId: ws.data.clientId,
                            action: parsedMsg.action
                        })
                    }
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

async function updateRooms() {
    //console.log("Connected clients: %s", Object.keys(WEBSOCKETS).length)

    for (const roomId of Object.keys(ROOMS2GAME)) {
        const game: Game = ROOMS2GAME[roomId]
        const newState = game.update()
        for (const clientId of game.getClientIds()) {
            const ws = WEBSOCKETS[clientId]
            if (!!ws) {
                sendUpdatedGameState(ws, newState)
            }
        }
    }
}
async function sendUpdatedGameState(ws, state: State) {
    const response = render(state, ws.data.clientId)
    ws.send(JSON.stringify(response))
}

setInterval(updateRooms, 1000);

