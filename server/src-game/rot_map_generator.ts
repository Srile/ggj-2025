import * as ROT from "../lib/rot.js"
import { MANIFEST } from "./manifest.js"
import { Map, tiles_create } from "./map.js"

const ENTITY_ID2SWITCH_ID = {
    "0": "switchA",
    "1": "switchB",
    "2": "switchC",
    "3": "switchD"
}

export function generate_rogue_dungeon(numberOfPlayers: number) {
    const rotMap = new ROT.Map.Rogue(32, 32)
    //console.log("Rot map: %o", rotMap)
    const tiles = []
    rotMap.create((x, y, tile) => {
        //console.log("%s %s: tile", x, y, tile);
        if (tile === 0) {
            tiles.push(tiles_create(MANIFEST.tiles.water))
        } else {
            tiles.push(tiles_create(MANIFEST.tiles.wall))
        }
    })
    //console.log(tiles)
    const map = new Map(
        "rogue" + crypto.randomUUID(),
        32,
        32,
        tiles
    )

    let playerNumber = numberOfPlayers - 1;
    while (playerNumber >= 0) {
        const x = getRandomInt(32)
        const y = getRandomInt(32)
        const tile = map.getTile(x, y)
        if (tile.type === MANIFEST.tiles.water) {
            map.setTile(x, y, MANIFEST.tiles["startplayer" + String(playerNumber)])
            playerNumber--
        }
    }

    let hasExit = false;
    while (!hasExit) {
        const x = getRandomInt(32)
        const y = getRandomInt(32)
        const tile = map.getTile(x, y)
        if (tile.type === MANIFEST.tiles.water) {
            map.setTile(x, y, MANIFEST.tiles.exit)
            hasExit = true
        }
    }

    let bubblesToSpawn = numberOfPlayers * 5;
    while (bubblesToSpawn > 0) {
        const x = getRandomInt(32)
        const y = getRandomInt(32)
        const tile = map.getTile(x, y)
        if (tile.type === MANIFEST.tiles.water) {
            map.setTile(x, y, MANIFEST.tiles.oxygen)
            bubblesToSpawn--;
        }
    }

    let switchesToSpawn = numberOfPlayers
    while (switchesToSpawn > 0) {
        const x = getRandomInt(32)
        const y = getRandomInt(32)
        const tile = map.getTile(x, y)
        const switchId = ENTITY_ID2SWITCH_ID[String(switchesToSpawn - 1)]
        if (tile.type === MANIFEST.tiles.water) {
            map.setTile(x, y, MANIFEST.tiles[switchId])
            switchesToSpawn--;
        }
    }

    return map;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}