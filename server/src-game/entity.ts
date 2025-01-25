import { State } from "./state.js";

export interface Entity {
    id: string,
    mapId: string,
    x: number,
    y: number,
    oxygen: number,
    oxygenMax: number,
}

export function entities_create(state: State, id: string, mapId: string, x=0, y=0,): State {
    const entity = {
        "id": id,
        "mapId": mapId,
        "x": x,
        "y": y,
        "oxygen": 20,
        "oxygenMax": 20,
    }

    state.entities[entity.id] = entity

    return state
}

export function entities_destroy(state: State, entityId: string) {
    state.entities[entityId] = undefined
    delete state.entities[entityId]

    state.tools[entityId] = undefined

    return state;
}

export function entities_get_by(state: State, mapId: string): Array<Entity> {
    let entity_ids = Object.keys(state.entities)
    let entities_on_map: Entity[] = []
    for (let i=0; i<entity_ids.length; i++) {
        let entity = state.entities[entity_ids[i]]
        if (entity.mapId === mapId) {
            entities_on_map.push(entity)
        }
    }
    return entities_on_map
}

export function entities_get_at(state: State, mapId: string, x: number, y: number): Entity | null {
    let entities_at_pos = entities_get_by(state, mapId).filter(e => e.x === x && e.y === y)
    if (entities_at_pos.length > 0) {
        return entities_at_pos[0]
    }
    return null
}

export function interactOrCombat(state: State, entityA: Entity, entityB: Entity) {
    if (entityA === entityB) { // Weird AI bug not moving when using entityInteractOrMove (with dx and dy === 0), thus NPCs would interact with themselves
        return state
    }

    // Combat
    const entityId = entityA.id
    const otherEntityId = entityB.id
    console.log("Combat between %s and %s", entityId, otherEntityId)

    return state
}