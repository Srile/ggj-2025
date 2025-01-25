# Unterwater Zoo Race

## Server

* Game server is reachable under [wss://ggj-2025.onrender.com](wss://ggj-2025.onrender.com)
* Test messages can be sent with https://piehost.com/websocket-tester

### Protocol

Clients may send JSON Strings:

0. Connect/disconnect to/from a room. Connecting also spawns you on the first free player position:

```json
{
    "command": "CONNECT",
    "roomId": "1337"
}
```

```json
{
    "command": "DISCONNECT",
}
```

1. Player movement. Send movement key (`"W"`, `"A"`, `"S"`, `"D"`):

```json
{
    "command": "ACTION",
    "action": "W"
}
```

Server may send the following JSON Strings:

```json
{
    "command": "SERVER_RESPONSE",
    "roomId": "1337",
    "player": 0,
    "turn": 5,
    "map": "map string\nmap string\n",
    "entities": {
        "0": {"x": 4, "y": 4, "oxygen": 20, "oxygenMax": 20},
        "1": {"x": 5, "y": 4, "oxygen": 20, "oxygenMax": 20},
        "2": {"x": 6, "y": 4, "oxygen": 20, "oxygenMax": 20},
        "3": {"x": 7, "y": 4, "oxygen": 20, "oxygenMax": 20},
    },
    "events": [
        {
            "type": "ENTITY_MOVED",
            "entityId": "0",
            "oldX": 4,
            "oldY": 4,
            "newX": 5,
            "newY": 4,
        },
        {
            "type": "ENTITY_ATTACKED",
            "entityId": "0",
        },
        {
            "type": "ENTITY_HIT",
            "entityId": "1",
        },
        {
            "type": "ENTITY_WON",
            "entityId": "0",
        },
        {
            "type": "COUNTDOWN",
            "countdown": 5,
        },
        {
            "type": "MAP_CHANGED"
        },
        {
            "type": "OXYGEN_CHANGED",
            "entityId": "0",
            "oxygen": 19,
            "oxygenMax": 20
        },
        {
            "type": "TILE_CHANGED",
            "oldTile": "o",
            "newTile": ".",
            "tileX": 1,
            "tileY": 1
        }

    ]

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
