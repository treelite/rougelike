/**
 * @file Role
 * @author treelite(c.xinle@gmail.com)
 */

import Tile from './Tile';
import AnimationController from './animation/AnimationController';
import {
    TILE_WIDTH, TILE_HEIGHT,
    Z_ROLE
} from './const';

export default class Role extends Tile {

    constructor(type, frames, keyFrame) {
        super({
            sWidth: TILE_WIDTH,
            sHeight: TILE_HEIGHT,
            type: type,
            z: Z_ROLE,
            trigger: true,
            active: true
        });

        this.animationController = new AnimationController(frames, keyFrame);
    }

    update(deltaTime) {
        this.animationController.play(this, deltaTime);
    }

}
