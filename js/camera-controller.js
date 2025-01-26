import {Component, ProjectionType, Property, ViewComponent} from '@wonderlandengine/api';
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
        if(this.camera.projectionType === ProjectionType.Orthographic) {
          this.extent = this.camera.extent;
        } else {
          this.object.getPositionLocal(tempVec)
          this.extent = tempVec[2];
        }
        this.engine.canvas.addEventListener('wheel', this.handleScroll.bind(this));
        this.engine.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.engine.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.engine.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.engine.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setPositionAbovePlayer(player) {
        player.getPositionWorld(tempVec)
        tempVec[1] = 20.0;
        tempVec[2] += 10.0;
        this.object.parent.setPositionWorld(tempVec);
        this.object.getPositionLocal(tempVec);
        this.extent = tempVec[2];
    }

    handleScroll(event) {
        // Get scroll direction
        const deltaY = event.deltaY;
        const scrollAmount = deltaY;
        
        this.extent += scrollAmount / 100;
        if(this.camera.projectionType === ProjectionType.Orthographic) {
          this.extent = Math.min(40, Math.max(20, this.extent));
          this.camera.extent = this.extent;
        } else {
          this.object.getPositionLocal(tempVec)
          this.extent = Math.min(20, Math.max(0, this.extent));
          tempVec[2] = this.extent;
          this.object.setPositionLocal(tempVec)
        }
        
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
  
    this.object.parent.translateWorld(tempVec);

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
