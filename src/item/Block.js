/**
 * @file Block
 * @author treelite(c.xinle@gmail.com)
 */

import Tile from '../Tile';
import * as resMgr from '../resourceManager';
import {TYPE_BLOCK, Z_ROLE, TILE_WIDTH, TILE_HEIGHT} from '../const'

const OFFSET_BLOCK = [
    [160, 64],
    [192, 64],
    [224, 64],
    [0, 96],
    [96, 96],
    [192, 96],
    [224, 96]
];

const OFFSET_BROKE = [
    [0, 192],
    [32, 192],
    [64, 192],
    [96, 192],
    [128, 192],
    [160, 192],
    [192, 192]
];

const MAX_HP = 4;

export default class Block extends Tile {

    constructor() {
        super({
            z: Z_ROLE,
            img: resMgr.get('spriteSheet'),
            trigger: true,
            type: TYPE_BLOCK,
            sWidth: TILE_WIDTH,
            sHeight: TILE_HEIGHT
        });
        this._hp = MAX_HP;
        let index = this.index = Math.round(Math.random() * (OFFSET_BLOCK.length - 1));
        [this.sx, this.sy] = OFFSET_BLOCK[index];
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        this._hp = value;
        if (value <= 0) {
            this.dispose();
        }
        else if (value <= MAX_HP / 2) {
            [this.sx, this.sy] = OFFSET_BROKE[this.index];
        }
    }

}
