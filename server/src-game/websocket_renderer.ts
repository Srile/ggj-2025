import { MAP } from "../example_map.js";
import { State } from "./state.js";

export function render(state: State, clientId: string) {
    return {
        command: "SERVER_RESPONSE",
        room: "1337",
        playerNumber: state._clientsToPlayers[clientId],
        map: MAP,
        turn: state.turn
    }
}