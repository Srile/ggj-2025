import { MAP } from "../example_map.js";
import { State } from "./state.js";

export function render(state: State) {
    return {
        command: "SERVER_RESPONSE",
        room: "1337",
        map: MAP,
        turn: state.turn
    }
}