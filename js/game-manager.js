import {Component, Property} from '@wonderlandengine/api';
import { WebSocketClient } from './networking';
import { playerController } from './player-controller';

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
    }

    joinGame() {
        this.ws = new WebSocketClient('wss://ggj-2025.onrender.com');

        playerController.registerNetworkEvents();
    }

    sendMovement(dir) {
        if(!this.ws) return console.error("game-manager: Can't move, server not joined");

        console.log({command: "ACTION", action: dir});
        this.ws.send({command: "ACTION", action: dir});
    }

    update(dt) {
        /* Called every frame. */
    }
}
