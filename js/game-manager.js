import {Component, Property} from '@wonderlandengine/api';
import { WebSocketClient } from './networking';
import { playerController } from './player-controller';
import { sceneParser } from './scene-parser';

export let gameManager;

export class GameManager extends Component {
    static TypeName = 'game-manager';
    /* Properties that are configurable in the editor */
    static Properties = {
        param: Property.float(1.0)
    };

    init() {
        gameManager = this;
    
        window.gameManager = this;

        const urlParams = new URLSearchParams(window.location.search);
        const roomId = urlParams.get('roomId');
        console.log('roomId', roomId);

        if(roomId) {
          const input = document.getElementById('inputField');
          input.value = roomId;
        } 
    }

    joinGame() {
        if(this.ws) return;
        this.ws = new WebSocketClient('wss://ggj-2025.onrender.com');

        playerController.registerNetworkEvents();
        this.registerNetworkEvents();
    }

    registerNetworkEvents() {
        this.ws.onMessage("COUNTDOWN", this.handleCountdown.bind(this));
        this.ws.onMessage("TILE_CHANGED", this.handleTileChanged.bind(this));
        this.ws.onMessage("ENTITY_ATTACKED", this.handleEntityAttacked.bind(this));
        this.ws.onMessage("ENTITY_HIT", this.handleEntityHit.bind(this));
    }

    handleCountdown(data) {
        const { countdown } = data;

        const countdownEl = document.querySelector('#countdown');
        countdownEl.innerText = countdown;
    }

    handleTileChanged(data) {
        const {oldTile, newTile, tileX, tileY} = data;

        // TODO logic for switching
        // e.g. animation

        sceneParser.removeTile(tileX, tileY);
        sceneParser.spawnTile(tileX, tileY, newTile);
    }

    handleEntityAttacked(data) {
        const {entity} = data;

        document.querySelector('#hitSfx').play();
        // TODO play animation, apply damage
    }

    handleEntityHit(data) {
        const {entity} = data;

        // TODO play animation
    }

    disconnect() {
        this.ws.close();
    }

    sendMovement(dir) {
        if(!this.ws) return console.error("game-manager: Can't move, server not joined");

        this.ws.send({command: "ACTION", action: dir});
    }
}
