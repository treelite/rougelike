/**
 * @file EventEmitter
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 所有的事件监听队列
 *
 * @type {WeakMap}
 */
let allEventQueues = new WeakMap();

/**
 * EventEmitter
 *
 * @class
 */
export default class {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     */
    constructor() {
        allEventQueues.set(this, {});
    }

    /**
     * 触发事件
     *
     * @public
     * @param {string} event 事件名称
     * @param {...*} args 事件参数
     */
    emit(event, ...args) {
        let eventQueues = allEventQueues.get(this);
        let listeners = eventQueues[event] || [];
        for (let listener of listeners) {
            listener.apply(this, args);
        }
    }

    /**
     * 添加事件监听
     *
     * @public
     * @param {string} event 事件名称
     * @param {Function} listener 事件监听函数
     */
    on(event, listener) {
        let eventQueues = allEventQueues.get(this);
        let listeners = eventQueues[event] || [];
        listeners.push(listener);
        eventQueues[event] = listeners;
    }

    /**
     * 取消事件监听
     *
     * @public
     * @param {string} event 事件名称
     * @param {Function} listener 事件监听函数
     */
    off(event, listener) {
        let eventQueues = allEventQueues.get(this);
        let listeners = eventQueues[event] || [];
        for (let [index, value] of listeners.entries()) {
            if (value === listener) {
                listeners.splice(index, 1);
                break;
            }
        }
    }

    /**
     * 添加只触发一次的事件监听
     *
     * @public
     * @param {string} event 事件名称
     * @param {Function} listener 事件监听函数
     */
    once(event, listener) {
        let fn = (...args) => {
            this.off(event, fn);
            listener.apply(this, args);
        };
        this.on(event, fn);
    }

    /**
     * 删除事件监听队列
     *
     * @public
     * @param {stirng=} event 事件名称，没有指定则删除所有的监听队列
     */
    remove(event) {
        let eventQueues = allEventQueues.get(this);
        if (!event) {
            allEventQueues.set(this, {});
        }
        else if (eventQueues.hasOwnProperty(event)) {
            delete eventQueues[event];
        }
    }

}
