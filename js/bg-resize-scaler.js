import {Component, Property} from '@wonderlandengine/api';
import { vec3 } from 'gl-matrix';

const tempVec = vec3.create();

export class BgResizeScaler extends Component {
    static TypeName = 'bg-resize-scaler';

    static Properties = {
        param: Property.float(1.0)
    };

    start() {
        window.addEventListener('resize', function(event) {
            // Get the window's inner width and height
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
          
            // You can also use clientWidth and clientHeight for the viewport dimensions
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
          
            // Log the dimensions to the console (you can replace this with your own logic)
            console.log('Window resized!');
            console.log('Window dimensions:', windowWidth, 'x', windowHeight);
            console.log('Viewport dimensions:', viewportWidth, 'x', viewportHeight);
          
            // Add your custom logic here to handle the resize event
            // ... existing code ...
          });
    }

    update(dt) {
        /* Called every frame. */
    }
}
