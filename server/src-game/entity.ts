import { State } from "./state.js";

export interface Entity {
    id: string,
    mapId: string,
    x: number,
    y: number,
    energy: number,
    energyMax: number,
    gold: number,
    matter: number,
    message: string | null,
    interactions: number,
    options: any
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