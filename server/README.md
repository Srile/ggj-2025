# Unterwater Zoo Race

## Server

Game server is reachable under wss://ggj-2025.onrender.com

### Protocol

Clients may send JSON Strings:

0. Connect/disconnect to/from a room:

```json
{
    "command": "CONNECT",
    "roomId": "RoomID"
}
```

```json
{
    "command": "DISCONNECT",
    "roomId": "RoomID"
}
```

1. Player movement. Send playerId (`"0"` to `"7"`) with the movement key (`"W"`, `"A"`, `"S"`, `"D"`):

```json
{
    "command": "MOVE",
    "0": "W"
}
```

Server may send the following JSON Strings:

```json
{
    "command": "SERVER_RESPONSE",
    "room": "RoomID",
    "playerId": "0",
    "turn": 5,
    "map": "map string\nmap string\n",
    "players": {
        "0": [1, 2],
        "1": [1, 3],
        "2": [1, 4],
        "3": [1, 5],
    }
}
```

* `turn`: Turn number
* `map`: The map as a String, see "Map Format" below
* `players`: Player positions

Errors:

```json
{
    "command": "SERVER_ERROR",
    "message": "Room is full"
}
```

### Map Format

See [example_map.ts](example_map.ts).

Legend:

* `#` ... Wall
* `.` ... Movable water, drains oxygen
* `O` ... The (locked) exit
* `A` - `H` ... Exit open switches
* `o` ... Oxygen, restores oxygen
* `0` - `7` ... Player start positions
