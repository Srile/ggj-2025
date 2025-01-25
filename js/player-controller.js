import {Component, Property} from '@wonderlandengine/api';
import { setHierarchyActive } from './utils';
import { currentPlayerSpawnPositions, gridWidth, sceneParser } from './scene-parser';
import { vec3 } from 'gl-matrix';

const ROTATION_DIRECTIONS = {
    up: 180,
    down: 0,
    right: 90,
    left: 270,
}

const ACTIVE_PLAYER_COUNT = 4;

const activePlayerLerpTime = []

for (let i = 0; i < ACTIVE_PLAYER_COUNT; i++) {
    activePlayerLerpTime.push(0.0);    
}

const activePlayerPositions = {
    0: {isMoving: false, startPosition: vec3.create(), targetPosition: vec3.create()},
    1: {isMoving: false, startPosition: vec3.create(), targetPosition: vec3.create()},
    2: {isMoving: false, startPosition: vec3.create(), targetPosition: vec3.create()},
    3: {isMoving: false, startPosition: vec3.create(), targetPosition: vec3.create()}
}

const tempVec = vec3.create();

export let playerController;

export class PlayerController extends Component {
    static TypeName = 'player-controller';

    static Properties = {
        playerMovementSpeed: Property.float(5.0)
    }

    init() {
        playerController = this; 
        this.playerObjects = [...this.object.children];
    }

    start() {
        if(sceneParser.debug) {
            this.registerKeyboardInput();
        }
    }

    registerKeyboardInput() {
        document.addEventListener('keydown', (event) => {
            if(activePlayerPositions[0].isMoving) return;

            switch(event.key) {
              case 'ArrowUp':
                this.movePlayer(0, 0, -1 * gridWidth);
                // Handle up arrow
                break;
              case 'ArrowDown':
                this.movePlayer(0, 0, 1 * gridWidth);
                // Handle down arrow
                break;
              case 'ArrowLeft':
                this.movePlayer(0, -1 * gridWidth, 0);
                // Handle left arrow
                break;
              case 'ArrowRight':
                this.movePlayer(0, 1 * gridWidth, 0);
                // Handle right arrow
                break;
            }
          });
    }

    movePlayer(playerIndex, moveDirectionX, moveDirectionZ) {
        const player = this.currentSelectedPlayerObjects[playerIndex];
        player.getPositionLocal(activePlayerPositions[playerIndex].startPosition);
        player.getPositionLocal(activePlayerPositions[playerIndex].targetPosition);
        vec3.set(tempVec, moveDirectionX, 0.0, moveDirectionZ)
        vec3.add(activePlayerPositions[playerIndex].targetPosition, activePlayerPositions[playerIndex].targetPosition, tempVec);
        activePlayerLerpTime[playerIndex] = 0.0;
        activePlayerPositions[playerIndex].isMoving = true;

        player.resetRotation();
        player.rotateAxisAngleDegLocal([0, 1, 0], this.getPlayerRotationAngleFromDirection(moveDirectionX, moveDirectionZ));
    }

    getPlayerRotationAngleFromDirection(moveDirectionX, moveDirectionZ) {
        if(moveDirectionX > 0) return ROTATION_DIRECTIONS.right;
        else if(moveDirectionX < 0) return ROTATION_DIRECTIONS.left;
        else if(moveDirectionZ > 0) return ROTATION_DIRECTIONS.down;
        else if(moveDirectionZ < 0) return ROTATION_DIRECTIONS.up;
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
        // TODO: Check if all players are used
        for (let i = 0; i < ACTIVE_PLAYER_COUNT; i++) {
            if(activePlayerPositions[i].isMoving) {
                activePlayerLerpTime[i] += dt * this.playerMovementSpeed;
                if(activePlayerLerpTime[i] >= 1.0) {
                    activePlayerLerpTime[i] = 1.0
                    activePlayerPositions[i].isMoving = false;
                }
                    
                vec3.lerp(tempVec, activePlayerPositions[i].startPosition, activePlayerPositions[i].targetPosition, activePlayerLerpTime[i]);
                this.currentSelectedPlayerObjects[i].setPositionLocal(tempVec);
            }
        }
    }
}
