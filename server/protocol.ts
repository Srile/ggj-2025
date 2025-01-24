export enum Command {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT"
}

export class Message {
    command: Command
    roomId: string | null
}