/**
 * @file Boot
 * @author treelite(c.xinle@gmail.com)
 */

import {SCREEN_HEIGHT, SCREEN_WIDTH} from './const';
import * as resMgr from './resourceManager';
import resource from './resource';

resMgr.config(resource);

/**
 * 加载资源
 *
 * @private
 * @return {Promise}
 */
function loadResources() {
    let process = resMgr.load('scriptMain', 'spriteSheet');
    process.on(
        'loaded',
        e => {
            console.log(`${e.num} / ${e.total}`);
        }
    );

    return new Promise(resolve => process.on('complete', res => resolve(res[0].default)));
}

/**
 * 初始化页面元素
 *
 * @private
 * @param {HTMLElement} ele Canvas 元素
 * @return {CanvasRenderingContext2D}
 */
function init(ele) {
    ele.height = SCREEN_HEIGHT;
    ele.width = SCREEN_WIDTH;
    return ele.getContext('2d');
}

/**
 * 启动游戏
 *
 * @public
 * @param {HTMLElement} ele Canvas DOM对象
 */
export default async function (ele) {
    let ctx = init(ele);
    let start = await loadResources();
    start(ctx);
}
