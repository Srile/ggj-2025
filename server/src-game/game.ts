import { entities_create, entities_destroy } from "./entity.js";
import { entity_act } from "./entity_map.js";
import { maps_create_all_manual } from "./map.js";
import { State, states_create } from "./state.js";

export interface ClientIdWithAction {
    clientId: string,
    action: string
}

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

    update(actions: Array<ClientIdWithAction>): State {
        this.state.turn++
        this.state._events = []

        if (!!actions) {
            console.log("Actions: %o", actions)
            for (const action of actions) {
                const playerId = String(this.state._clientsToPlayers[action.clientId])
                const player = this.state.entities[playerId]
                this.state = entity_act(this.state, player, action.action)
            }
        }
        //this.state = systems_per_turn_update(this.state)

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