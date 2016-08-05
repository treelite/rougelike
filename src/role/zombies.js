/**
 * @file Zombies
 * @author treelite(c.xinle@gmail.com)
 */

import Role from '../Role';
import * as resMgr from '../resourceManager';
import SpriteAnimation from '../animation/SpriteAnimation';
import {TYPE_ENEMY, TYPE_PLAYER, TYPE_ANIMATION_SPRITE} from '../const';

const ANIMATE_IDLE = Symbol('idle');
const ANIMATE_ATTACK = Symbol('attack');

const FRAMES_IDLE = [
    [[192, 0], [224, 0], [0, 32], [32, 32], [64, 32], [96, 32]],
    [[128, 32], [160, 32], [192, 32], [224, 32], [0, 64], [32, 64]]
];

const FRAMES_ATTACK = [
    [[64, 160], [96, 160]],
    [[128, 160], [160, 160]]
];

const AP_VALUE = [10, 20];

export default class Zombies extends Role {
    constructor() {
        let index = Math.round(Math.random());
        super(
            TYPE_ENEMY,
            {
                [ANIMATE_IDLE]: {
                    type: TYPE_ANIMATION_SPRITE,
                    img: resMgr.get('spriteSheet'),
                    frames: FRAMES_IDLE[index],
                    duration: 0.8
                },
                [ANIMATE_ATTACK]: {
                    type: TYPE_ANIMATION_SPRITE,
                    img: resMgr.get('spriteSheet'),
                    frames: FRAMES_ATTACK[index],
                    duration: 0.3,
                    totalTime: 0.3,
                    next: ANIMATE_IDLE
                }
            },
            ANIMATE_IDLE
        );
        this.ap = AP_VALUE[index];
    }

    meet(tile) {
        if (tile.type === TYPE_PLAYER) {
            tile.hp -= this.ap;
            this.animationController.state = ANIMATE_ATTACK;
        }
    }

    chase(target) {
        let res = [0, 0];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        if (Math.abs(dx) >= Math.abs(dy)) {
            res[0] = dx >= 0 ? 1 : -1
        }
        else {
            res[1] = dy >= 0 ? 1 : -1;
        }
        return res;
    }
}
