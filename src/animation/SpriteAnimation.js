/**
 * @file Sprite Animation
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from '../util/EventEmitter';

export default class SpriteAnimation extends EventEmitter {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {Object} options 选项
     * @param {Image} optins.img Sprite sheet
     * @param {Array} options.frames offset key frams
     * @param {number} options.duration duration
     * @param {number=} options.totalTime total time
     * @param {boolean=} optins.repeated repeat playing
     */
    constructor({img, frames, duration, totalTime = Number.MAX_SAFE_INTEGER, repeated = true}) {
        super();
        this.img = img;
        this.frames = frames;
        this.duration = duration * 1000;
        this.totalTime = totalTime * 1000;
        this.time = 0;
        this.dt = this.duration / this.frames.length;
        this.end = false;
        this.repeated = repeated;
    }

    /**
     * 执行动画
     *
     * @public
     * @param {Tile} tile tile
     * @param {number} deltaTime 间隔时间
     */
    play(tile, deltaTime) {
        if (this.end || (!this.repeated && this.time > this.duration)) {
            return;
        }
        else if (this.time >= this.totalTime) {
            this.end = true;
            this.emit('end');
        }
        else {
            this.time += deltaTime;
            let index = Math.floor(this.time / this.dt);
            let [sx, sy] = this.frames[index % this.frames.length];
            tile.setImage(this.img, sx, sy);
        }
    }

    /**
     * 重置动画
     *
     * @public
     */
    reset() {
        this.time = 0;
        this.end = false;
    }
}

