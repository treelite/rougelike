/**
 * @file Animation Controller
 * @author treelite(c.xinle@gmail.com)
 */

import {TYPE_ANIMATION_SPRITE} from '../const';
import SpriteAnimation from './SpriteAnimation';

const ANIMATIONS = {
    [TYPE_ANIMATION_SPRITE]: SpriteAnimation
};

export default class {

    constructor(animations, entry = 'main') {
        this.flows = {};
        let keys = Reflect.ownKeys(animations);
        this.key = entry;

        for (let key of keys) {
            let config = animations[key];
            let Animation = ANIMATIONS[config.type];
            let animation = this.flows[key] = new Animation(config);
            if (config.next) {
                animation.on('end', () => this.state = config.next);
            }
        }
    }

    get animation() {
        return this.flows[this.key];
    }

    get state() {
        return this.key;
    }

    set state(value) {
        this.animation.reset();
        this.key = value;
    }

    play(tile, deltaTime) {
        this.animation.play(tile, deltaTime);
    }

}
