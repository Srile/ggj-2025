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

export const gridWidth = 2;

export function isNewLine(char) {
    return char === '\n' || char === '\r';
}

const tempVec = vec3.create();

export let sceneParser;

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

    init() {
        sceneParser = this;
    }

    start() {
        if(this.debug) {
            this.setupLevel(testString)
        }
    }

    setupLevel(mapString) {
        this.spawnLevel(mapString);
        playerController.initializePlayers();
    }

    cleanLevel() {
        this.currentLevelAsssetContainer.destroy();
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
                    case characterRegistry.floor:

                        return;
                    case characterRegistry.oxygen:

                        return;
                    case characterRegistry.exit:

                        return;
                }
            } else {
                if(characterRegistry.switch.includes(char)) {
                    
                    return;
                } else if(characterRegistry.spawnPoint.includes(char)) {
                    const spawnPointPositionIndex = characterRegistry.spawnPoint.indexOf(char)
                    vec3.copy(currentPlayerSpawnPositions[spawnPointPositionIndex], position);
                    currentPlayerSpawnPositions[spawnPointPositionIndex][1] = 1.0;
                    return;
                }
            }
        }
    }

    spawnLevel(levelString) {
        let currentXPosition = startingXPosition;
        let currentZPosition = startingZPosition;

        this.currentLevelAsssetContainer = this.object.addChild();

        for (let i = 0; i < levelString.length; i++) {
            const char = levelString[i];
            if(isNewLine(char)) {
                currentXPosition = startingXPosition;
                currentZPosition += gridWidth;
            } else {
                const asset = this.getAssetPrototypeFromCharacter(char);
                currentXPosition += gridWidth;
                const newAsset = asset.clone(this.currentLevelAsssetContainer);
                tempVec[0] = currentXPosition;
                tempVec[2] = currentZPosition;
                this.checkCharacterLogic(char, tempVec)
                newAsset.setPositionWorld(tempVec);
                
                // newAsset.setScalingLocal([0.9,0.9,0.9])
            }
        }
    }
}
