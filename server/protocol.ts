export type Command = "CONNECT"
    | "DISCONNECT"
    | "ACTION"
    | "SERVER_ERROR"
    | "SERVER_RESPONSE"

export type Action = "W"
    | "A"
    | "S"
    | "D"

export interface Message {
    command: Command
    action: Action | null
    roomId: string | null
    turn: number | null
    player: number | null
    map: string | null
    entities: object | null // entityId/playerNumber as string mapped to position
}