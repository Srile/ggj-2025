import { entities_create, entities_destroy } from "./entity.js";
import { maps_create_all_manual } from "./map.js";
import { State, states_create } from "./state.js";

const PLAYER_NUMBERS = new Set([0, 1, 2, 3, 4, 5, 6, 7])

export default class Game {
    state: State;

    constructor() {
    }

    init(): State {
        this.state = states_create()
        this.state = maps_create_all_manual(this.state)
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
            this.state._usedPlayerNumbers.add(playerNumber)
            this.state._clientsToPlayers[clientId] = playerNumber
            const playerId = String(playerNumber)
            const spawnPoint = this.state._maps["1337"].getSpawnPointForPlayer(playerId) // TODO hardcoded mapId
            if (!!spawnPoint) {
                this.state = entities_create(this.state, playerId, "1337", spawnPoint[0], spawnPoint[1])
            }
        } else {
            // Game full
            return null
        }
        console.log("AddedPlayer state._clientsToPlayers: %o", this.state._clientsToPlayers)
        return this.state
    }

    removePlayer(clientId: string): State {
        const playerNumber: number = this.state._clientsToPlayers[clientId]
        this.state._usedPlayerNumbers.delete(playerNumber)
        delete this.state._clientsToPlayers[clientId]
        this.state = entities_destroy(this.state, String(playerNumber))
        console.log("RemovedPlayer state._clientsToPlayers: %o", this.state._clientsToPlayers)
        return this.state
    }
}