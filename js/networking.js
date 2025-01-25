import { sceneParser } from "./scene-parser";

export class WebSocketClient {
    constructor(url) {
      this.url = url;
      this.ws = null;
      this.messageHandlers = new Map();
      this.connect();
      this.connectedToGame = false;
    }
  
    connect() {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('Connected to server');
        this.send({command: "CONNECT", roomId: "1337"});
      };
  
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const events = message.events;

        if(!this.connectedToGame) {
            this.connectedToGame = true;
            startGame();
            sceneParser.setupLevel(message.map);
        } 

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const handler = this.messageHandlers.get(event.type);
            if (handler) {
              handler(event);
            }
        }
      };
  
      this.ws.onclose = () => {
        console.log('Disconnected from server');
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    send(data) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      } else {
        console.warn('WebSocket is not connected');
      }
    }
  
    onMessage(command, handler) {
      this.messageHandlers.set(command, handler);
    }
  
    close() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }