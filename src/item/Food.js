/**
 * @file Food
 * @author treelite(c.xinle@gmail.com)
 */

import Tile from '../Tile';
import * as resMgr from '../resourceManager';
import {
    ID_FOOD_SODA, ID_FOOD_TOMATO,
    TILE_WIDTH, TILE_HEIGHT,
    TYPE_FOOD,
    Z_ITEM,
} from '../const';

let properties = {
    [ID_FOOD_SODA]: {
        value: 10,
        sx: 64,
        sy: 64
    },
    [ID_FOOD_TOMATO]: {
        value: 5,
        sx: 96,
        sy: 64
    }
};

export default class Food extends Tile {

    constructor(name) {
        let property = properties[name];
        super({
            img: resMgr.get('spriteSheet'),
            sWidth: TILE_WIDTH,
            sHeight: TILE_HEIGHT,
            sx: property.sx,
            sy: property.sy,
            z: Z_ITEM,
            type: TYPE_FOOD,
            name: name,
            trigger: true
        });
        this.value = property.value;
    }

}
