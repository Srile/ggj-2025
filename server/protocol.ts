export type Command = "CONNECT"
    | "DISCONNECT"

export interface Message {
    command: Command
    roomId: string | null
}