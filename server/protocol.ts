export type Command = "CONNECT"
    | "DISCONNECT"
    | "ACTION"
    | "SERVER_ERROR"
    | "SERVER_RESPONSE"

export type Action = "W"
    | "A"
    | "S"
    | "D"

export type EventType = "ENTITY_MOVED"
    | "ENTITY_WON"
    | "COUNTDOWN"
    | "MAP_CHANGED"
    | "OXYGEN_CHANGED"
    | "PLAYER_JOINED"
    | "PLAYER_LEFT"

export interface Event {
    type: EventType
    entityId?: string
    oldX?: number
    oldY?: number
    newX?: number
    newY?: number
    oxygen?: number
    oxygenMax?: number
    countdown?: number
}

export interface Message {
    command: Command
    action: Action | null
    roomId: string | null
    turn: number | null
    player: number | null
    map: string | null
    entities: object | null // entityId/playerNumber as string mapped to position
    events: Array<Event>
}