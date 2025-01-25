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

export interface Event {
    type: EventType
    entityId: string | null
    oldX: number | null
    oldY: number | null
    newX: number | null
    newY: number | null
    countdown: number | null
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