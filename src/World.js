/**
 * @file World
 * @author treelite(c.xinle@gmail.com)
 */

import Tile from './Tile';
import Scene from './Scene';
import Food from './item/Food';
import Block from './item/Block';
import Zombies from './role/Zombies';
import * as resMgr from './resourceManager';
import {
    WORLD_WIDTH, WORLD_HEIGHT,
    TILE_WIDTH, TILE_HEIGHT,
    PLAYER_POS_X, PLAYER_POS_Y,
    EXIT_POS_X, EXIT_POS_Y,
    ID_FOOD_SODA, ID_FOOD_TOMATO,
    TYPE_WALL, TYPE_FLOOR, TYPE_EXIT, TYPE_PLAYER,
    Z_ITEM,
} from './const';

/**
 * 岩壁偏移量
 *
 * @const
 * @type {Array}
 */
const OFFSET_WALLS = [
    [32, 96],
    [64, 96]
];

/**
 * 地板偏移量
 *
 * @const
 * @type {Array}
 */
const OFFSET_FLOORS = [
    [0, 128],
    [32, 128],
    [64, 128],
    [96, 128],
    [128, 128],
    [160, 128],
    [192, 128],
    [224, 128]
];

function createTile(sx, sy, z, type, trigger) {
    return new Tile({
        sx: sx, sy: sy,
        img: resMgr.get('spriteSheet'),
        sWidth: TILE_WIDTH, sHeight: TILE_HEIGHT,
        z: z,
        type: type,
        trigger: trigger
    });
}

function drawFloors(world) {
    let tile;
    let maxFloors = OFFSET_FLOORS.length - 1;
    for (let x = 1; x < world.width - 1; x++) {
        for (let y = 1; y < world.height - 1; y++) {
            tile = createTile(...OFFSET_FLOORS[Math.round(Math.random() * maxFloors)], 0, TYPE_FLOOR);
            world.set(tile, x, y);
        }
    }
}

function drawFoods(world) {
    [ID_FOOD_TOMATO, ID_FOOD_SODA].forEach(name => {
        let food = new Food(name);
        world.random(food);
    });
}

function drawBlocks(world) {
    let max = Math.max(Math.round(Math.log2(world.level)), 2);
    for (let i = 0; i < max; i++) {
        let block = new Block();
        world.random(block);
    }
}

function drawWalls(world) {
    let tile;
    let x = 0;
    let y = 0;
    let sideNum = world.height - 2;
    let max = (world.width + sideNum) * 2;
    for (let i = 0; i < max; i++) {
        if (i < world.width) {
            x = i;
            y = 0;
        }
        else if (i < world.width + sideNum) {
            x = 0;
            y = i - world.width + 1;
        }
        else if (i < world.width + 2 * sideNum) {
            x = world.width - 1;
            y = i - world.width - sideNum + 1;
        }
        else {
            x = i - world.width - 2 * sideNum;
            y = world.height - 1;
        }
        tile = createTile(
            ...OFFSET_WALLS[Math.round(Math.random())],
            Number.MAX_SAFE_INTEGER,
            TYPE_WALL
        );
        world.set(tile, x, y);
    }
}

function drawExit(world) {
    let tile = createTile(128, 64, Z_ITEM, TYPE_EXIT, true);
    world.set(tile, EXIT_POS_X, EXIT_POS_Y);
    tile.on('meet', item => item.type === TYPE_PLAYER && world.emit('exit'));
}

function drawZombies(world) {
    let res = [];
    let zombies;
    let level = world.level;
    let max = level === 1 ? 1 : Math.round(Math.log(level));
    for (let i = 0; i < max; i++) {
        zombies = new Zombies();
        world.random(zombies);
        res.push(zombies);
    }
    return res;
}

/**
 * World
 *
 * @class
 * @extends Scene
 */
export default class World extends Scene {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {number} level 关卡层数
     */
    constructor(level) {
        super(WORLD_WIDTH, WORLD_HEIGHT);
        this.level = level;
        this.layout = [
            this.pos2Index(PLAYER_POS_X, PLAYER_POS_Y),
            this.pos2Index(EXIT_POS_X, EXIT_POS_Y)
        ];
        drawWalls(this);
        drawFloors(this);
        drawFoods(this);
        drawExit(this);
        drawBlocks(this);
        this.enemites = drawZombies(this);
    }

    /**
     * 随机安放 Tile
     *
     * @public
     * @param {} tile
     */
    random(tile) {
        let x = 1;
        let y = 1;
        let width = this.width - 2;
        let height = this.height - 2;
        let max = width * height - 1;
        let index = Math.round(Math.random() * max);
        x += index % width;
        y += Math.floor(index / width);
        index = this.pos2Index(x, y);

        if (this.layout.indexOf(index) >= 0) {
            this.random(tile);
        }
        else {
            this.layout.push(index);
            this.set(tile, x, y);
        }
    }

    moveEnemies(player) {
        for (let enemy of this.enemites) {
            this.move(enemy, ...enemy.chase(player));
        }
    }

}
