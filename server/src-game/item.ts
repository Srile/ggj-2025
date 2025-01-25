import { MANIFEST, Item as ItemType } from "./manifest.js";
import { State } from "./state.js"

export interface Item {
    id: string,
    type: ItemType,
    mapId: string,
    x: number,
    y: number,
    energy: number,
    gold: number,
    matter: number
}

export function items_destroy(state: State, itemId: string) {
    state.items[itemId] = undefined
    delete state.items[itemId]

    return state
}

export function items_get_by(state: State, mapId: string): Array<Item> {
    let itemIds = Object.keys(state.items)
    let itemsOnMap: Item[] = []
    for (let i=0; i<itemIds.length; i++) {
        let item = state.items[itemIds[i]]
        if (item.mapId === mapId) {
            itemsOnMap.push(item)
        }
    }
    return itemsOnMap
}
