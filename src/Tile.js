/**
 * @file Tile
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from './util/EventEmitter';

export default class Tile extends EventEmitter {

    /**
     * 构造函数
     * TODO
     * 添加已失效标示，支持 Lazy Remove
     *
     * @public
     * @constructor
     * @param {} options
     */
    constructor(options = {}) {
        super();
        this.type = options.type;
        this.name = options.name;

        this.trigger = options.trigger;
        this.active = options.active;

        this.z = options.z || 0;
        this.level = options.level || 0;

        this.img = options.img;
        this.sWidth = options.sWidth || 32;
        this.sHeight = options.sHeight || 32;
        this.sx = options.sx || 0;
        this.sy = options.sy || 0;
    }

    meet(item) {
        this.emit('meet', item);
    }

    update() {}

    setImage(img, sx, sy) {
        this.img = img;
        this.sx = sx;
        this.sy = sy;
    }

    dispose() {
        this.img = null;
        if (this.scene) {
            this.scene.remove(this);
        }
    }

}
