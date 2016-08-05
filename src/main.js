/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

import World from './World';
import Camera from './Camera';
import Player from './role/Player';
import * as resMgr from './resourceManager';
import Keyboard from './controller/Keyboard';
import {
    SCREEN_HEIGHT, SCREEN_WIDTH,
    VIEW_WIDTH, VIEW_HEIGHT,
    PLAYER_POS_X, PLAYER_POS_Y,
    TIME_DELTA_MAX, TIME_DELTA_ST
} from './const';

let level;
let player;
let world;
let controller = new Keyboard();

function init() {
    level = 0;
    player = new Player();
    player.on('died', () => {
        controller.disable();
        console.log('Game Over');
    });
    createWorld();
    controller.enable();
}

function createWorld() {
    world = new World(++level);
    world.set(player, PLAYER_POS_X, PLAYER_POS_Y);
    world.on('exit', () => setTimeout(createWorld, 300));
}

function move(x, y) {
    world.move(player, x, y);
    world.moveEnemies(player);
}

let inputHandler = {
    up() {move(0, -1)},
    down() {move(0, 1)},
    left() {move(-1, 0)},
    right() {move(1, 0)}
};

export default function (ctx) {
    let camera = new Camera({
        ctx: ctx,
        viewWidth: VIEW_WIDTH,
        viewHeight: VIEW_HEIGHT,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT
    });

    init();

    // 输入控制
    controller.on('keyup', key => inputHandler.hasOwnProperty(key) && inputHandler[key]());

    let lastRenderTime = Date.now();
    // 渲染每一帧
    function render() {
        let now = Date.now();
        let deltaTime = now - lastRenderTime;
        if (deltaTime > TIME_DELTA_MAX) {
            deltaTime = TIME_DELTA_ST;
        }

        world.update(deltaTime);
        camera.shot(world);

        lastRenderTime = now;
        requestAnimationFrame(render);
    }
    render();
}
