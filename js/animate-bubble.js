import {Component, Property} from '@wonderlandengine/api';

const tempVec = new Float32Array(3);

/**
 * animate-bubble
 */
export class AnimateBubble extends Component {
    static TypeName = 'animate-bubble';
    /* Properties that are configurable in the editor */
    static Properties = {
        speed: Property.float(1.0)
    };

    start() {
        console.log('start() with param', this.param);
        this.t = Math.random();

        const mesh = this.object.getComponent('mesh');
        this.material = mesh.material;
    }

    update(dt) {
        /* Called every frame. */

        this.t += dt;

        tempVec[0] = 1.0 + Math.sin(this.speed*this.t*Math.PI)*0.125;
        tempVec[1] = 1.0 + Math.sin(this.speed*this.t*Math.PI + 0.5*Math.PI)*0.125;
        tempVec[2] = 1.0 + Math.sin(this.speed*this.t*Math.PI + Math.PI)*0.125;

        this.object.setScalingLocal(tempVec);

        this.material.time = this.t;
    }
}
