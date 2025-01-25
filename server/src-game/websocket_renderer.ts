import { MAP } from "../example_map.js";
import { Message } from "../protocol.js";
import { State } from "./state.js";

export function render(state: State, clientId: string): Message {
    return {
        command: "SERVER_RESPONSE",
        action: null,
        roomId: "1337",
        player: state._clientsToPlayers[clientId],
        map: MAP,
        turn: state.turn
    }
}