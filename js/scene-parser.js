import {Component, Property} from '@wonderlandengine/api';
import { vec3 } from 'gl-matrix';
import { playerController } from './player-controller';

export const testString = `
################################
#A.oooooooooooooooooooooooooo.B#
#..............................#
#o............................o#
#o..0......................1..o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o.............OO.............o#
#o.............OO.............o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o..2......................3..o#
#o............................o#
#..............................#
#C.oooooooooooooooooooooooooo.D#
################################
`;

const characterRegistry = {
    wall: '#',
    floor: '.',
    switch: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    oxygen: 'o',
    spawnPoint: ['0', '1', '2', '3', '4', '5', '6', '7'],
    exit: 'O',
}

let currentSpawnPointIndex = 0;
export const currentPlayerSpawnPositions = [
    vec3.create(),
    vec3.create(),
    vec3.create(),
    vec3.create()
]

const characterRegistryKeys = Object.keys(characterRegistry);

/* Grid Variables */
const startingXPosition = -32;
const startingZPosition = -32;

const gridWidth = 2;

export function isNewLine(char) {
    return char === '\n' || char === '\r';
}

const tempVec = vec3.create();

export class SceneParser extends Component {
    static TypeName = 'scene-parser';

    static Properties = {
        wallPrototype: Property.object(),
        floorPrototype: Property.object(),
        switchPrototype: Property.object(),
        oxygenPrototype: Property.object(),
        spawnPointPrototype: Property.object(),
        exitPrototype: Property.object(),
        debug: Property.bool(true),
    };

    start() {
        if(this.debug) {
            this.spawnLevel(testString);
    
            setTimeout(() => {
                playerController.initializePlayers();
            }, 300);
        }
    }

    getAssetPrototypeFromCharacter(char) {
        for (let i = 0; i < characterRegistryKeys.length; i++) {
            const key = characterRegistryKeys[i];
            const value = characterRegistry[key];
            
            if(value instanceof String && char === value) {
                return this[key + "Prototype"];
            } else {
                for (let j = 0; j < value.length; j++) {
                    const currentValueChar = value[j];
                    if(char === currentValueChar) {
                        return this[key + "Prototype"];
                    }
                }
            }
        }
    }

    checkCharacterLogic(char, position) {
        for (let i = 0; i < characterRegistryKeys.length; i++) {
            const key = characterRegistryKeys[i];
            const value = characterRegistry[key];
                
            if(value instanceof String && char === value) {
                switch (char) {
                    case characterRegistry.wall:

                        return;
                        break;
                    case characterRegistry.floor:

                        return;
                        break;
                    case characterRegistry.oxygen:

                        return;
                        break;
                    case characterRegistry.exit:

                        return;
                        break;
                }
            } else {
                if(characterRegistry.switch.includes(char)) {
                    
                    return;
                } else if(characterRegistry.spawnPoint.includes(char)) {
                    vec3.copy(currentPlayerSpawnPositions[currentSpawnPointIndex], position);
                    currentPlayerSpawnPositions[currentSpawnPointIndex][1] = 1.0;
                    currentSpawnPointIndex++;
                    return;
                }
            }
        }
    }

    initializeNewLevel() {
        currentSpawnPointIndex = 0;
    }

    spawnLevel(levelString) {
        this.initializeNewLevel();

        let currentXPosition = startingXPosition;
        let currentZPosition = startingZPosition;
        for (let i = 0; i < levelString.length; i++) {
            const char = levelString[i];
            if(isNewLine(char)) {
                currentXPosition = startingXPosition;
                currentZPosition += gridWidth;
            } else {
                const asset = this.getAssetPrototypeFromCharacter(char);
                currentXPosition += gridWidth;
                const newAsset = asset.clone(this.object);
                tempVec[0] = currentXPosition;
                tempVec[2] = currentZPosition;
                this.checkCharacterLogic(char, tempVec)
                newAsset.setPositionWorld(tempVec);
                // newAsset.setScalingLocal([0.9,0.9,0.9])
            }
        }
    }
}
