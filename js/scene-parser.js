import {Component, Property} from '@wonderlandengine/api';
import { vec3 } from 'gl-matrix';
import { playerController } from './player-controller';

const UP = [0, 1, 0];

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
        this.map = null;
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
        this.map = null;
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

    checkCharacterLogic(char, position, object) {
        for (let i = 0; i < characterRegistryKeys.length; i++) {
            const key = characterRegistryKeys[i];
            const value = characterRegistry[key];
                
            if(char === value) {
                switch (char) {
                    case characterRegistry.wall:
                        object.rotateAxisAngleDegLocal(UP, Math.random() * 360.0);
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
                    // currentPlayerSpawnPositions[spawnPointPositionIndex][1] = 1.0;
                    return;
                }
            }
        }
    }

    removeTile(x, y) {
        this.map[y][x].object.destroy();
        this.map[y][x] = null;
    }

    spawnTile(x, y, char) {
        if(this.map[y][x]) this.removeTile(x, y);
        const asset = this.getAssetPrototypeFromCharacter(char);
        const newAsset = asset.clone(this.currentLevelAsssetContainer);
        tempVec[0] = startingXPosition + gridWidth*x;
        tempVec[2] = startingZPosition + gridWidth*y;
        this.checkCharacterLogic(char, tempVec, newAsset);
        newAsset.setPositionWorld(tempVec);
        this.map[y][x] = {
            object: newAsset,
            char
        };
    }

    spawnLevel(levelString) {
        this.currentLevelAsssetContainer = this.object.addChild();

        let x = 0;
        let y = 0;
        this.map = [[]];

        for(const char of levelString) {
            if(isNewLine(char)) {
                this.map.push([]);
                y++;
                x = 0;
            } else {
                this.map[y].push(null);
                x++;
                this.spawnTile(x, y, char);

                // newAsset.setScalingLocal([0.9,0.9,0.9])
            }
        }
    }
}
