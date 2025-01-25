import { State, states_create } from "./state.js";

const PLAYER_NUMBERS = new Set([0, 1, 2, 3, 4, 5, 6, 7])

export default class Game {
    state: State;

    constructor() {
    }

    init(): State {
        this.state = states_create()

        return this.state
    }

    update(actions: Array<object>): State {
        if (!!actions) {
            console.log("Actions: %o", actions)
        }
        this.state.turn++
        return this.state
    }

    addPlayer(clientId: string): State | null {
        const availablePlayerNumbers: Set<number> = PLAYER_NUMBERS.difference(this.state._usedPlayerNumbers)
        if (availablePlayerNumbers.size > 0) {
            const playerNumber = [...availablePlayerNumbers.keys()][0]
            this.state._clientsToPlayers[clientId] = playerNumber
        } else {
            // Game full
            return null
        }
        console.log("AddPlayer state._clientsToPlayers: %o", this.state._clientsToPlayers)
        return this.state
    }

    removePlayer(clientId: string): State {
        const playerNumber: number = this.state._clientsToPlayers[clientId]
        this.state._usedPlayerNumbers.delete(playerNumber)
        delete this.state._clientsToPlayers[clientId]
        console.log("RemovePlayer state._clientsToPlayers: %o", this.state._clientsToPlayers)
        return this.state
    }
}