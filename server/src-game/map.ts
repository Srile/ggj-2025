import { MAP } from "../example_map.js";
import { Event } from "../protocol.js";
import { entities_destroy, entities_get_by } from "./entity.js";
import { items_destroy, items_get_by } from "./item.js";
import { MANIFEST, Tile as TileType } from "./manifest.js";
import { generate_rogue_dungeon } from "./rot_map_generator.js";
import { State } from "./state.js";

export const CHUNK_SIZE = {
    "width": 16, // in tiles
    "height": 16
}
export const MAP_SIZE = CHUNK_SIZE // in chunks

interface Tile {
    type: TileType,
    options: object
}

export function tiles_create(type: TileType, options={}): Tile {
    return {
        "type": type,
        "options": options
    }
}

export function maps_create_all_manual(state: State): State {
    //let map: Map = maps_parse(MAP)
    let map: Map = generate_rogue_dungeon(4)
    state._maps[map.id] = map
    state.currentMapId = map.id
    return state
}

export function maps_destroy(state: State, mapId: string): State {
    const items = items_get_by(state, mapId)
    for (let i=0; i<items.length; i++) {
        const item = items[i]
        state = items_destroy(state, item.id)
    }

    const entities = entities_get_by(state, mapId)
    for (let i=0; i<entities.length; i++) {
        const entity = entities[i]
        state = entities_destroy(state, entity.id)
    }

    state._maps[mapId] = undefined
    delete state._maps[mapId]

    return state
}

const SPAWN_ICONS = new Set(["0", "1", "2", "3"])
const SWITCH_ICONS = new Set(["A", "B", "C", "D"])

export class Map {
    id: string;
    widthTiles: number;
    heightTiles: number;
    seed: number | null;
    private _tiles: Tile[];
    private _spawnPoints: object;
    private _switchesToActivate: number = 0;

    constructor(id: string, width_tiles: number, height_tiles: number, tiles: Tile[]=[]) {
        this.id = id;
        this.widthTiles = width_tiles;
        this.heightTiles = height_tiles;
        this.seed = null
        this._tiles = tiles;
        this._switchesToActivate = 0;

        this._spawnPoints = {}
        for (let y = 0; y < this.heightTiles; y++) {
            for (let x = 0; x < this.widthTiles; x++) {
                const icon: string = this.getTile(x, y)?.type?.icon
                if (SPAWN_ICONS.has(icon)) {
                    this._spawnPoints[icon] = [x, y]
                }

                if (SWITCH_ICONS.has(icon)) {
                    this._switchesToActivate++
                }
            }
        }
    }

    getTile(x: number, y: number): Tile | any {
        if (x >= 0 && x < this.widthTiles
            && y >= 0 && y < this.heightTiles) {
            let tile_index = y * this.widthTiles + x;
            return this._tiles[tile_index];
        }

        return {};
    }

    setTile(x: number, y: number, tileType: TileType, options={}): Tile {
        let tileIndex = y * this.widthTiles + x
        const oldTile = this._tiles[tileIndex]
        this._tiles[tileIndex] = tiles_create(tileType, options)

        const icon: string = tileType.icon
        if (SPAWN_ICONS.has(icon)) {
            this._spawnPoints[icon] = [x, y]
        }

        if (SWITCH_ICONS.has(icon)) {
            this._switchesToActivate++
        }
        if (SWITCH_ICONS.has(oldTile.type.icon)) {
            this._switchesToActivate--
        }

        return oldTile
    }

    getSpawnPointForPlayer(playerId: string): Array<number> | null {
        if (Object.hasOwn(this._spawnPoints, playerId)) {
            return this._spawnPoints[playerId]
        }

        console.log("Unknown spawnpoint for player %s, all points: %o", playerId, this._spawnPoints)

        return null
    }

    openExitIfPossible(): Array<Event> {
        const events = []

        if (this._switchesToActivate <= 0) {
            for (let y = 0; y < this.heightTiles; y++) {
                for (let x = 0; x < this.widthTiles; x++) {
                    const tileType: TileType = this.getTile(x, y)?.type

                    if (tileType === MANIFEST.tiles.exit) {
                        this.setTile(x, y, MANIFEST.tiles.exitopen)
                        events.push({
                            type: "TILE_CHANGED",
                            oldTile: tileType.icon,
                            newTile: MANIFEST.tiles.exitopen.icon,
                            tileX: x,
                            tileY: y
                        })
                    }
                }
            }
        }

        return events
    }
}

const ICON2TILETYPE = {
    "#": MANIFEST.tiles.wall,
    ".": MANIFEST.tiles.water,
    "o": MANIFEST.tiles.oxygen,
    "O": MANIFEST.tiles.exit,
    "0": MANIFEST.tiles.startplayer0,
    "1": MANIFEST.tiles.startplayer1,
    "2": MANIFEST.tiles.startplayer2,
    "3": MANIFEST.tiles.startplayer3,
    "4": MANIFEST.tiles.startplayer4,
    "5": MANIFEST.tiles.startplayer5,
    "6": MANIFEST.tiles.startplayer6,
    "7": MANIFEST.tiles.startplayer7,
    "A": MANIFEST.tiles.switchA,
    "B": MANIFEST.tiles.switchB,
    "C": MANIFEST.tiles.switchC,
    "D": MANIFEST.tiles.switchD,
    "a": MANIFEST.tiles.switcha,
    "b": MANIFEST.tiles.switchb,
    "c": MANIFEST.tiles.switchc,
    "d": MANIFEST.tiles.switchd,
}

export function maps_parse(mapString: string): Map {
    let lines = mapString.trim().split(/\r?\n/)
    let width = 0
    let height = lines.length
    let tiles: any[] = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        width = line.length

        for (let j = 0; j < line.length; j++) {
            let character = line[j];
            let tileType = ICON2TILETYPE[character];
            tiles.push(tiles_create(tileType))
        }
    }

    const createdMap = new Map(
        crypto.randomUUID(),
        width,
        height,
        tiles
    );

    console.log("Parsed map of size %sx%s", createdMap.widthTiles, createdMap.heightTiles)

    return createdMap;
}
