import {Component, Property} from '@wonderlandengine/api';

const UP = [0, 1, 0];

/**
 * animate-portal
 */
export class AnimatePortal extends Component {
    static TypeName = 'animate-portal';
    /* Properties that are configurable in the editor */
    static Properties = {
        speed: Property.float(1.0)
    };

    start() {
        console.log('start() with param', this.param);
    }

    update(dt) {
        this.object.rotateAxisAngleDegObject(UP, this.speed*dt);
        /* Called every frame. */
    }
}
