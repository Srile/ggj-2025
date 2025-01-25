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

function entityInteractOrMove(state: State, entity: Entity, dx: number, dy: number, recursion=0): State { // TODO dirty hack with the recursion
    // Check for collision:
    /*
    entity -> combat (hostile), interact (friendly)
    tile -> mine (rock), block movement (wall)

    if movement can happen:
    move, pickup items on-tile movement, go through portals on-tile movement
    */
    const map = state._maps[entity.mapId]
    const entity_at_target_position = entities_get_at(state, map.id, entity.x + dx, entity.y + dy)

    if (!!entity_at_target_position) {
        // Friend or foe
        state = interactOrCombat(state, entity, entity_at_target_position)

    } else if (_entity_can_move(map, entity, dx, dy)) {
        state = _entity_move(state, map, entity, dx, dy)
        //state._energyQueue.push({entityId: entity.id, energyDelta: -1 * recursion}) // Pushing rocks

    }

    return state
}

function _entity_can_move(map: Map, entity: Entity, dx: number, dy: number): boolean {
    let x = entity.x + dx;
    let y = entity.y + dy;
    let tileType = map.getTile(x, y).type;
    return x >= 0 && x < map.widthTiles && y >= 0 && y < map.heightTiles
        && !(tileType === MANIFEST.tiles.wall
             || tileType === MANIFEST.tiles.exit);
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

    // Exit
    let tile = map.getTile(entity.x, entity.y);
    if (tile.type.name.startsWith('exit')) {
        state = _enterPortalOrPlanet(state, entity, tile)
    }

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

    state._events.push({
        type: "ENTITY_MOVED",
        entityId: entity.id,
        oldX: oldX,
        oldY: oldY,
        newX: entity.x,
        newY: entity.y,
    })

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