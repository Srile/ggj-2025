import {Component, Property, ViewComponent} from '@wonderlandengine/api';
import { vec3 } from 'gl-matrix';

let isDragging = false;
let lastMousePosition = { x: 0, y: 0 };

const tempVec = vec3.create();

export let cameraController;

export class CameraController extends Component {
    static TypeName = 'camera-controller';

    start() {
        cameraController = this;

        this.camera = this.object.getComponent(ViewComponent);
        this.extent = this.camera.extent;
        window.addEventListener('wheel', this.handleScroll.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setPositionAbovePlayer(player) {
        player.getPositionWorld(tempVec)
        tempVec[1] = 50.0;
        this.object.parent.setPositionWorld(tempVec);
    }

    handleScroll(event) {
        // Get scroll direction
        const deltaY = event.deltaY;
        const scrollAmount = deltaY;
      
        this.extent += scrollAmount / 100;
        this.extent = Math.min(40, Math.max(20, this.extent));
        this.camera.extent = this.extent;
    }

    
    handleMouseDown(event) {
        event.preventDefault(); // Prevent context menu

        isDragging = true;
        lastMousePosition = {
        x: event.clientX,
        y: event.clientY
        };
        document.body.style.cursor = 'grabbing';
    };
  
  handleMouseMove(event) {
    if (!isDragging) return;
  
    const deltaX = event.clientX - lastMousePosition.x;
    const deltaY = event.clientY - lastMousePosition.y;
  
    // Update camera position based on mouse movement
    tempVec[0] = -deltaX * 0.05;
    tempVec[1] = 0;
    tempVec[2] = -deltaY * 0.05;
  
    this.object.translateWorld(tempVec);
    this.object.getPositionWorld(tempVec)

    lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };
  
    handleMouseUp(event) {
        event.preventDefault(); // Prevent context menu
        isDragging = false;
        document.body.style.cursor = 'unset';
    };

    update(dt) {

    }
}
