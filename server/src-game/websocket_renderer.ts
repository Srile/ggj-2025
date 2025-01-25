import { Message } from "../protocol.js";
import { Entity } from "./entity.js";
import { Map } from "./map.js";
import { State } from "./state.js";

export function render(state: State, clientId: string): Message {
    return {
        command: "SERVER_RESPONSE",
        action: null,
        roomId: "1337",
        player: state._clientsToPlayers[clientId],
        turn: state.turn,
        entities: render_entities(state),
        events: state._events,
        map: render_map(state, "1337"),
    }
}

function render_entities(state: State): object {
    const entities = {}
    for (const entityId of Object.keys(state.entities)) {
        const entity: Entity = state.entities[entityId]
        entities[entityId] = {
            x: entity.x,
            y: entity.y,
            oxygen: entity.oxygen,
            oxygenMax: entity.oxygenMax
        }
    }
    return entities
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