import { Event } from "../protocol.js"

export interface ClientIdWithAction {
    clientId: string,
    action: string
}

export interface State {
    _AIs: object,
    _combatQueue: Array<{entityId: string, otherEntityId: string}>,
    _despawnQueue: Array<string>,
    _energyQueue: Array<{entityId: string, energyDelta: number}>
    _eventSubscribers: object,
    _menuOpen: boolean,
    actionLog: Array<string>,
    chatLog: Array<string>,
    currentMapId: string,
    entities: object,
    items: object,
    lastSpacePositionByEntity: object
    tools: object,

    _actions: Array<ClientIdWithAction>,
    _usedPlayerNumbers: Set<number>,
    _clientsToPlayers: object,
    _events: Array<Event>,
    _maps: object,
    turn: number
}

export function states_create(): State {
    return {
        _AIs: {},
        _combatQueue: [],
        _despawnQueue: [],
        _energyQueue: [],
        _eventSubscribers: {},
        _menuOpen: true,
        actionLog: [],
        chatLog: [],
        currentMapId: "",
        entities: {},
        items: {},
        lastSpacePositionByEntity: {},
        tools: {},

        _actions: [],
        _usedPlayerNumbers: new Set(),
        _clientsToPlayers: {},
        _events: [],
        _maps: {},
        turn: -1 // negative: waiting state
    }
}