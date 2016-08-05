/**
 * @file 玩家角色
 * @author treelite(c.xinle@gmail.com)
 */

import Role from '../Role';
import * as resMgr from '../resourceManager';
import {
    TYPE_PLAYER, TYPE_FOOD, TYPE_BLOCK,
    TYPE_ANIMATION_SPRITE
} from '../const';

const ANIMATE_IDLE = 'idle';
const ANIMATE_ATTACK = 'attack';
const ANIMATE_HURTED = 'hurted';

export default class Player extends Role {

    constructor() {
        super(
            TYPE_PLAYER,
            {
                [ANIMATE_IDLE]: {
                    type: TYPE_ANIMATION_SPRITE,
                    img: resMgr.get('spriteSheet'),
                    frames: [[0, 0], [32, 0], [64, 0], [96, 0], [128, 0], [160, 0]],
                    duration: 0.8
                },
                [ANIMATE_ATTACK]: {
                    type: TYPE_ANIMATION_SPRITE,
                    img: resMgr.get('spriteSheet'),
                    frames: [[0, 160], [32, 160]],
                    duration: 0.3,
                    totalTime: 0.3,
                    next: ANIMATE_IDLE
                },
                [ANIMATE_HURTED]: {
                    type: TYPE_ANIMATION_SPRITE,
                    img: resMgr.get('spriteSheet'),
                    frames: [[192, 160], [224, 160]],
                    duration: 0.3,
                    totalTime: 0.3,
                    next: ANIMATE_IDLE
                }
            },
            ANIMATE_IDLE
        );

        this._hp = 100;
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        if (value < this._hp) {
            this.animationController.state = ANIMATE_HURTED;
        }
        this._hp = value;
        if (value <= 0) {
            this.emit('died');
        }
    }

    meet(tile) {
        switch(tile.type) {
            case TYPE_FOOD:
                this.hp += tile.value;
                tile.dispose();
                break;
            case TYPE_BLOCK:
                tile.hp -= 2;
                this.animationController.state = ANIMATE_ATTACK;
                break;
        }
    }

}
