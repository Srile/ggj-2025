import {Component, Property} from '@wonderlandengine/api';
import { vec3 } from 'gl-matrix';

const scale = vec3.create();
const originalScale = vec3.create();
const tempVec = vec3.create();

export class BgResizeScaler extends Component {
    static TypeName = 'bg-resize-scaler';

    start() {
        this.object.getScalingWorld(originalScale);
        this.object.getScalingWorld(scale);

        window.addEventListener('resize', () => {
            this.setScaleFromWindowSize();
        });
        this.setScaleFromWindowSize();
    }

    setScaleFromWindowSize() {
        // Get the window's inner width and height
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if(windowWidth > windowHeight) {
            const ratio =windowWidth / windowHeight;
            vec3.scale(scale, originalScale, 1.0 / ratio);
            this.object.setScalingWorld(scale);
        } else {
            this.object.setScalingWorld(originalScale);
        }
    }
}
