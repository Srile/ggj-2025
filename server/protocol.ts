export type Command = "CONNECT"
    | "DISCONNECT"

export class Message {
    command: Command
    roomId: string | null
}