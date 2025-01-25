import { Message } from "../protocol.js";
import { Map } from "./map.js";
import { State } from "./state.js";

export function render(state: State, clientId: string): Message {
    return {
        command: "SERVER_RESPONSE",
        action: null,
        roomId: "1337",
        player: state._clientsToPlayers[clientId],
        turn: state.turn,
        entities: state.entities,
        map: render_map(state, "1337"),
    }
}

function render_map(state: State, mapId: string): string {
    const map: Map = state._maps[mapId]
    let buffer = ""
    for (let y = 0; y < map.heightTiles; y++) {
        for (let x = 0; x < map.widthTiles; x++) {
            buffer += map.getTile(x, y)?.type?.icon
        }
        buffer += "\n"
    }
    return buffer
}