/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

import World from './World';
import Camera from './Camera';
import Player from './role/Player';
import Curation from './ui/Curtain';
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
let curation;
let pause = true;
let controller = new Keyboard();

async function init(ctx) {
    level = 0;
    player = new Player();
    player.on('died', () => {
        controller.disable();
        curation.fadeIn(`Game Over`);
        pause = true;
    });
    createWorld();
    controller.enable();
    curation = new Curation(ctx, SCREEN_WIDTH, SCREEN_HEIGHT, 1);
    curation.show(`Level ${level}`);
    await curation.fadeOut(1)
    pause = false;
}

function createWorld() {
    world = new World(++level);
    world.set(player, PLAYER_POS_X, PLAYER_POS_Y);
    world.on('exit', async () => {
        pause = true;
        await curation.fadeIn(`Level ${level + 1}`);
        createWorld();
        await curation.fadeOut(1);
        pause = false;
    });
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

    init(ctx);

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

        if (!pause) {
            world.update(deltaTime);
        }
        camera.shot(world);
        if (pause) {
            curation.render(deltaTime);
        }

        lastRenderTime = now;
        requestAnimationFrame(render);
    }
    render();
}
