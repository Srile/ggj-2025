import {Component, Property} from '@wonderlandengine/api';
import { setHierarchyActive } from './utils';
import { currentPlayerSpawnPositions } from './scene-parser';

const ACTIVE_PLAYER_COUNT = 4;

export let playerController;

export class PlayerController extends Component {
    static TypeName = 'player-controller';

    init() {
        playerController = this; 
        this.playerObjects = [...this.object.children];
    }

    initializePlayers() {
        this.currentSelectedPlayerObjects = this.getSelectedPlayers();
        for (let i = 0; i < this.currentSelectedPlayerObjects.length; i++) {
            const playerObject = this.currentSelectedPlayerObjects[i];
            const position = currentPlayerSpawnPositions[i];
            playerObject.setPositionLocal(position);
        }
    }

    getSelectedPlayers() {
        if(this.playerObjects.length < ACTIVE_PLAYER_COUNT) throw console.error("player-controller: More children on object are required")

            const randomIndices = [];
            const playerObjects = [];
            while(randomIndices.length < ACTIVE_PLAYER_COUNT) {
            let newIndex = Math.floor(Math.random() * this.playerObjects.length);
            while(randomIndices.includes(newIndex)) {
                newIndex = Math.floor(Math.random() * this.playerObjects.length);
            }
            randomIndices.push(newIndex);            
        }

        // Deactivate not selected player objects
        for (let i = 0; i < this.playerObjects.length; i++) {
            const playerObject = this.playerObjects[i];
            if(randomIndices.includes(i)) {
                setHierarchyActive(playerObject, true);
                playerObjects.push(playerObject);
            } else {
                setHierarchyActive(playerObject, false);
            }
        }

        return playerObjects;
    }

    update(dt) {
        /* Called every frame. */
    }
}
