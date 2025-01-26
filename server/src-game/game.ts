import { MAP } from "../example_map.js";
import * as ROT from "../lib/rot.js"
import { entities_create, entities_destroy, Entity } from "./entity.js";
import { entity_act } from "./entity_map.js";
import { Map, maps_create_all_manual, maps_parse } from "./map.js";
import { generate_rogue_dungeon } from "./rot_map_generator.js";
import { ClientIdWithAction, State, states_create } from "./state.js";

const PLAYER_NUMBERS = new Set([0, 1, 2, 3])

export default class Game {
    state: State;
    roomId: string;

    constructor(roomId: string) {
        this.roomId = roomId
    }

    init(): State {
        this.state = states_create(this.roomId)
        this.state = maps_create_all_manual(this.state)
        return this.state
    }

    update(): State {
        this.state.turn++
        this.state._events = []

        if (!!this.state._actions) {
            console.log("Actions: %o", this.state._actions)
            for (const clientId of Object.keys(this.state._actions)) {
                const action = this.state._actions[clientId]
                const playerId = String(this.state._clientsToPlayers[clientId])
                const player = this.state.entities[playerId]
                this.state = entity_act(this.state, player, action)
            }
            this.state._actions = {}
        }

        if (this.state.countdown > -1) {
            if (this.state.countdown === 0) {
                // new map
                let map: Map = generate_rogue_dungeon(4)
                this.state._maps[map.id] = map
                this.state.currentMapId = map.id

                this.state._events.push({
                    type: "MAP_CHANGED"
                })

                for (const clientId of Object.keys(this.state._clientsToPlayers)) {
                    const playerNumber = this.state._clientsToPlayers[clientId]
                    const playerId = String(playerNumber)
                    console.log("Changing map for playerId: %s", playerId)
                    const playerEntity: Entity = this.state.entities[playerId]
                    if (!!playerEntity) {
                        playerEntity.mapId = this.state.currentMapId
                        const spawnPoint = this.state._maps[this.state.currentMapId].getSpawnPointForPlayer(playerId)
                        playerEntity.x = spawnPoint[0]
                        playerEntity.y = spawnPoint[1]
                        playerEntity.oxygen = 80
                    }
                }

            } else {
                this.state._events.push({
                    type: "COUNTDOWN",
                    countdown: this.state.countdown
                })

            }
            this.state.countdown--
        }
        //this.state = systems_per_turn_update(this.state)

        return this.state
    }

    addPlayer(clientId: string): State | null {
        const availablePlayerNumbers: Set<number> = PLAYER_NUMBERS.difference(this.state._usedPlayerNumbers)
        if (availablePlayerNumbers.size > 0) {
            const playerNumber = ROT.RNG.getItem([...availablePlayerNumbers.keys()])
            this.state._usedPlayerNumbers.add(playerNumber)
            this.state._clientsToPlayers[clientId] = playerNumber
            const playerId = String(playerNumber)
            const spawnPoint = this.state._maps[this.state.currentMapId].getSpawnPointForPlayer(playerId)
            if (!!spawnPoint) {
                this.state = entities_create(this.state, playerId, this.state.currentMapId, spawnPoint[0], spawnPoint[1])
                this.state._events.push({
                    type: "PLAYER_JOINED",
                    entityId: playerId,
                    oldX: spawnPoint[0],
                    oldY: spawnPoint[1],
                    newX: spawnPoint[0],
                    newY: spawnPoint[1],
                })
                const playerEntity = this.state.entities[playerId]
                this.state._events.push({
                    type: "OXYGEN_CHANGED",
                    entityId: playerId,
                    oxygen: playerEntity.oxygen,
                    oxygenMax: playerEntity.oxygenMax
                })
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
        const playerId = String(playerNumber)
        this.state = entities_destroy(this.state, playerId)
        this.state._events.push({
            type: "PLAYER_LEFT",
            entityId: playerId,
        })
        console.log("RemovedPlayer state._clientsToPlayers: %o", this.state._clientsToPlayers)
        return this.state
    }

    addAction(action: ClientIdWithAction): State {
        this.state._actions[action.clientId] = action.action
        return this.state
    }

    getClientIds(): Array<string> {
        return Object.keys(this.state._clientsToPlayers)
    }
}