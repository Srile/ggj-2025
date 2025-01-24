import { State, states_create } from "./state.js";

export default class Game {
    state: State;

    constructor() {
    }

    init(): State {
        this.state = states_create()

        return this.state
    }

    update(actions): State {
        return this.state
    }
}