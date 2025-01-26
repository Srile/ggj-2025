import {Component, Property} from '@wonderlandengine/api';
import { setHierarchyActive } from './utils';
import { currentPlayerSpawnPositions, gridWidth, sceneParser, startingXPosition, startingZPosition } from './scene-parser';
import { vec3 } from 'gl-matrix';
import { gameManager } from './game-manager';
import { cameraController } from './camera-controller';

const ROTATION_DIRECTIONS = {
    up: 180,
    down: 0,
    right: 90,
    left: 270,
}

function movementDirectionToString(moveDirectionX, moveDirectionZ) {
    if(moveDirectionX > 0) return "D";
    else if(moveDirectionX < 0) return "A";
    else if(moveDirectionZ > 0) return "S";
    else if(moveDirectionZ < 0) return "W";
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
        playerMovementSpeed: Property.float(5.0),
        currentPlayerIndicatorMesh: Property.object(),
        deadPlayerMaterial: Property.material(),
    }

    init() {
        playerController = this; 
        this.playerObjects = [...this.object.children];
    }

    start() {
        this.registerKeyboardInput();
    }

    setCameraPositionFromPlayerIndex(playerIndex) {
        cameraController.setPositionAbovePlayer(this.currentSelectedPlayerObjects[playerIndex]);
        this.ownPlayerIndex = playerIndex;

        this.currentPlayerIndicatorMesh.clone(this.currentSelectedPlayerObjects[playerIndex]);
    }

    registerNetworkEvents() {
        gameManager.ws.onMessage("ENTITY_MOVED", this.handleNetworkMove.bind(this));
        gameManager.ws.onMessage("ENTITY_WON", this.handleGameWon.bind(this));
        gameManager.ws.onMessage("OXYGEN_CHANGED", this.handleOxygenChaned.bind(this));

        gameManager.ws.onMessage("PLAYER_JOINED", this.handlePlayerJoined.bind(this));
        gameManager.ws.onMessage("PLAYER_LEFT", this.handlePlayerLeft.bind(this));

    }

    setNetworkPlayersActive(entities) {
        const entityIds = Object.keys(entities);

        for (let i = 0; i < entityIds.length; i++) {
            const positions = entities[entityIds[i]];
            tempVec[0] = startingXPosition + gridWidth*positions.x;
            tempVec[1] = 0;
            tempVec[2] = startingZPosition + gridWidth*positions.y;
            
            const id = entityIds[i];
            const index = Number(id);

            this.currentSelectedPlayerObjects[index].setPositionLocal(tempVec);
            setHierarchyActive(this.currentSelectedPlayerObjects[index], true);
        }
    }

    handlePlayerJoined(data) {
        const {entityId} = data;
        const index = Number(entityId);

        setHierarchyActive(this.currentSelectedPlayerObjects[index], true);
    }

    handlePlayerLeft(data) {
        const {entityId} = data;
        const index = Number(entityId);

        setHierarchyActive(this.currentSelectedPlayerObjects[index], false);
    }

    handleOxygenChaned(data) {
        const {oxygen, oxygenMax, entityId} = data;
        const index = Number(entityId);
        if(index === this.ownPlayerIndex) {
            if(!this.oldOxygen) this.oldOxygen = oxygenMax;

            if(this.oldOxygen < oxygen) document.querySelector('#bubbleSfx').play();
            setHealth(100 * (oxygen / oxygenMax));
            this.oldOxygen = oxygen;
        } 

        if(oxygen === 0) {
            const meshes = this.currentSelectedPlayerObjects[index].findByNameRecursive('Mesh');
            const meshComp = meshes[0].getComponent('mesh');
            meshComp.material = this.deadPlayerMaterial;
        }
    }

    handleNetworkMove(data) {
        const {oldX, oldY, newX, newY, entityId} = data;
        
        const playerIndex = Number(entityId);

        if(newX > oldX) this.movePlayer(playerIndex, 1 * gridWidth, 0);
        else if(newX < oldX) this.movePlayer(playerIndex, -1 * gridWidth, 0);
        else if(newY > oldY) this.movePlayer(playerIndex, 0, 1 * gridWidth);
        else if(newY < oldY) this.movePlayer(playerIndex, 0, -1 * gridWidth);

        const arrow = document.getElementById('arrow');
        arrow.classList.remove('active');
    }

    handleGameWon(data) {
        const { entityId } = data;

        if(Number(entityId) === this.ownPlayerIndex) {
            document.querySelector('#winSfx').play();
            endGame(true);
        } else {
            document.querySelector('#loseSfx').play();
            endGame(false);
        }
    }

    registerKeyboardInput() {
        document.addEventListener('keydown', (event) => {
            if(activePlayerPositions[0].isMoving) return;
            switch(event.key) {
              case 'ArrowUp':
              case 'w':
              case 'W':
                this.handleMovement(0, 0, -1 * gridWidth);
                // Handle up arrow
                break;
              case 'ArrowDown':
              case 's':
              case 'S':
                this.handleMovement(0, 0, 1 * gridWidth);
                // Handle down arrow
                break;
              case 'ArrowLeft':
              case 'A':
              case 'a':
                this.handleMovement(0, -1 * gridWidth, 0);
                // Handle left arrow
                break;
              case 'ArrowRight':
              case 'D':
              case 'd':
                this.handleMovement(0, 1 * gridWidth, 0);
                // Handle right arrow
                break;
            }
          });
    }

    handleMovement(playerIndex, moveDirectionX, moveDirectionZ) {
        if(sceneParser.debug) {
            this.movePlayer(playerIndex, moveDirectionX, moveDirectionZ);
        } else {
            gameManager.sendMovement(movementDirectionToString(moveDirectionX, moveDirectionZ));
        }
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

        if(playerIndex === this.ownPlayerIndex) {
            document.querySelector('#whooshSfx').play();
        }
    }

    getPlayerRotationAngleFromDirection(moveDirectionX, moveDirectionZ) {
        if(moveDirectionX > 0) return ROTATION_DIRECTIONS.right;
        else if(moveDirectionX < 0) return ROTATION_DIRECTIONS.left;
        else if(moveDirectionZ > 0) return ROTATION_DIRECTIONS.down;
        else if(moveDirectionZ < 0) return ROTATION_DIRECTIONS.up;
    }

    initializePlayers() {
        this.currentSelectedPlayerObjects = this.getSelectedPlayers();
        this.setPlayerPositions();
    }

    setPlayerPositions() {
        for (let i = 0; i < this.currentSelectedPlayerObjects.length; i++) {
            const playerObject = this.currentSelectedPlayerObjects[i];
            const position = currentPlayerSpawnPositions[i];
            playerObject.setPositionLocal(position);
        }
    }

    getSelectedPlayers() {
        if(this.playerObjects.length < ACTIVE_PLAYER_COUNT) throw console.error("player-controller: More children on object are required")

        const randomIndices = [0, 1, 2, 4];
        const newPlayerObjects = [];
        // while(randomIndices.length < ACTIVE_PLAYER_COUNT) {
        //     let newIndex = Math.floor(Math.random() * this.playerObjects.length);
        //     while(randomIndices.includes(newIndex)) {
        //         newIndex = Math.floor(Math.random() * this.playerObjects.length);
        //     }
        //     randomIndices.push(newIndex);            
        // }   

        // Deactivate not selected player objects
        for (let i = 0; i < this.playerObjects.length; i++) {
            const playerObject = this.playerObjects[i];
            if(randomIndices.includes(i)) {
                setHierarchyActive(playerObject, false);
                newPlayerObjects.push(playerObject);
            } else {
                setHierarchyActive(playerObject, false);
            }
        }

        return newPlayerObjects;
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
