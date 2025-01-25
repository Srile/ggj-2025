import { entities_get_at, Entity, interactOrCombat } from "./entity.js"
import { MANIFEST } from "./manifest.js"
import { Map } from "./map.js"
import { State } from "./state.js"

export function entity_act(state: State, entity: Entity, command: string): State {
    switch (command) {
        case "W":
            state = entityInteractOrMove(state, entity, 0, -1)
            break
        case "A":
            state = entityInteractOrMove(state, entity, -1, 0)
            break
        case "S":
            state = entityInteractOrMove(state, entity, 0, 1)
            break
        case "D":
            state = entityInteractOrMove(state, entity, 1, 0)
            break
        default:
    }

    return state;
}

function entityInteractOrMove(state: State, entity: Entity, dx: number, dy: number): State {
    if (entity.oxygen <= 0) {
        return state;
    }

    const map = state._maps[entity.mapId]
    const entity_at_target_position = entities_get_at(state, map.id, entity.x + dx, entity.y + dy)

    if (!!entity_at_target_position) {
        // Friend or foe
        state = interactOrCombat(state, entity, entity_at_target_position)

    } else if (_entity_can_move(map, entity, dx, dy)) {
        state = _entity_move(state, map, entity, dx, dy)

    }

    return state
}

function _entity_can_move(map: Map, entity: Entity, dx: number, dy: number): boolean {
    let x = entity.x + dx;
    let y = entity.y + dy;
    let tileType = map.getTile(x, y).type;
    return x >= 0 && x < map.widthTiles && y >= 0 && y < map.heightTiles
        && !(tileType === MANIFEST.tiles.wall);
//             || tileType === MANIFEST.tiles.exit);
}

function _entity_move(state: State, map: Map, entity: Entity, dx: number, dy: number): State {
    const oldX = entity.x;
    const oldY = entity.y;
    entity.x += dx;
    entity.y += dy;

    // Item pickup
    /*
    let maybeItem = items_get_at(state, entity.mapId, entity.x, entity.y);
    if (!!maybeItem) {
        state = items_pickup(state, entity, maybeItem);
    }
    */

    state._events.push({
        type: "ENTITY_MOVED",
        entityId: entity.id,
        oldX: oldX,
        oldY: oldY,
        newX: entity.x,
        newY: entity.y,
    })

    // Exit
    let tile = map.getTile(entity.x, entity.y);
    if (tile.type.name.startsWith('Exit')) {
        //state = _enterPortalOrPlanet(state, entity, tile)
        state._events.push({
            type: "ENTITY_WON",
            entityId: entity.id,
        })
        state.countdown = 5;
    } else if (tile.type === MANIFEST.tiles.oxygen) {
        entity.oxygen = Math.min(entity.oxygen + 5, entity.oxygenMax)
        map.setTile(entity.x, entity.y, MANIFEST.tiles.water)
        state._events.push({
            type: "TILE_CHANGED",
            oldTile: MANIFEST.tiles.oxygen.icon,
            newTile: MANIFEST.tiles.water.icon,
            tileX: entity.x,
            tileY: entity.y
        })
    }

    // Oxygen cost for movement
    entity.oxygen = Math.max(entity.oxygen - 1, 0)
    state._events.push({
        type: "OXYGEN_CHANGED",
        entityId: entity.id,
        oxygen: entity.oxygen,
        oxygenMax: entity.oxygenMax
    })

    // Move{north, east, south, west} tile
    /*
    if (tile.type.name.startsWith('move')) {
        switch (tile.type.name) {
            case 'movenorth': state = entityInteractOrMove(state, entity, 0, -1); break;
            case 'moveeast': state = entityInteractOrMove(state, entity, 1, 0); break;
            case 'movesouth': state = entityInteractOrMove(state, entity, 0, 1); break;
            case 'movewest': state = entityInteractOrMove(state, entity, -1, 0); break;
            default:
        }
    }
    */

    return state;
}


function _enterPortalOrPlanet(state: State, entity: Entity, tile: any): State {
    /*
    if (entity.id.startsWith("player")) {
        state.currentMapId = tile.options.mapId;
    }
    */

    entity.mapId = tile.options.mapId;
    entity.x = tile.options.x;
    entity.y = tile.options.y;

    return state;
}