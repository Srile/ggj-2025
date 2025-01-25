import { entities_create, entities_destroy } from "./entity.js";
import { entity_act } from "./entity_map.js";
import { maps_create_all_manual } from "./map.js";
import { ClientIdWithAction, State, states_create } from "./state.js";



const PLAYER_NUMBERS = new Set([0, 1, 2, 3, 4, 5, 6, 7])

export default class Game {
    state: State;
    roomId: string;

    constructor(roomId: string) {
        this.roomId = roomId
    }

    init(): State {
        this.state = states_create()
        this.state = maps_create_all_manual(this.state)
        return this.state
    }

    update(): State {
        this.state.turn++
        this.state._events = []

        if (!!this.state._actions) {
            console.log("Actions: %o", this.state._actions)
            for (const action of this.state._actions) {
                const playerId = String(this.state._clientsToPlayers[action.clientId])
                const player = this.state.entities[playerId]
                this.state = entity_act(this.state, player, action.action)
            }
            this.state._actions = []
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

    addAction(action: ClientIdWithAction): State {
        this.state._actions.push(action)
        return this.state
    }

    getClientIds(): Array<string> {
        return Object.keys(this.state._clientsToPlayers)
    }
}