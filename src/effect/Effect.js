/**
 * @file Effect
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from '../util/EventEmitter';
import * as renderHelper from '../util/renderHelper';

export default class Effect extends EventEmitter {

    constructor(ctx, duration, ...properties) {
        super();
        this.ctx = ctx;
        this.properties = properties;
        this.time = 0;
        this.duration = duration;
    }

    render(deltaTime) {
        renderHelper.push(this.ctx, ...this.properties);

        if (this.duration && this.time > this.duration) {
            return;
        }

        this.time += deltaTime;
        this.apply();

        if (this.duration && this.time > this.duration) {
            this.emit('end');
        }
    }

    revert() {
        renderHelper.pop(this.ctx);
    }

    reset() {
        this.time = 0;
    }

    /**
     * 应用特效
     *
     * @public
     * @param {string} property 特效的属性名称
     * @return {Function}
     */
    static apply(property) {
        return function (target, key, descriptor) {
            let method = descriptor.value;
            descriptor.value = function (deltaTime, ...args) {
                let effects = this[property] || [];
                if (!Array.isArray(effects)) {
                    effects = [effects];
                }
                for (let item of effects) {
                    item.render(deltaTime);
                }
                method.call(this, deltaTime, ...args);
                effects = effects.reverse();
                for (let item of effects) {
                    item.revert(deltaTime);
                }
            };
        };
    }
}
