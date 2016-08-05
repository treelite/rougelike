/**
 * @file 键盘控制器
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from '../util/EventEmitter';

const ARROW_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
let controllers = [];

let eventHandler = (type, e) => controllers.forEach(item => item.process(type, e));
let eventNames = ['keyup', 'keydown', 'keypress'];
let globalEventHandlers = {};
eventNames.forEach(name => globalEventHandlers[name] = e => eventHandler(name, e));

let attachEvents = () => eventNames.forEach(name => window.addEventListener(name, globalEventHandlers[name]));
let detachEvents = () => eventNames.forEach(name => window.removeEventListener(name, globalEventHandlers[name]));

function register(controller) {
    if (!controllers.length) {
        attachEvents();
    }
    controllers.push(controller);
}

function unRegister(controller) {
    let index = controllers.indexOf(controller);
    controllers.splice(index, 1);
    if (!controllers.length) {
        detachEvents();
    }
}

/**
 * 键盘控制器
 *
 * @class
 * @extends EventEmitter
 */
export default class Keyboard extends EventEmitter {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     */
    constructor() {
        super();
        this.active = true;
        register(this);
    }

    /**
     * 销毁控制器
     *
     * @public
     */
    dispose() {
        unRegister(this);
    }

    /**
     * Enable
     *
     * @public
     */
    enable() {
        this.active = true;
    }

    /**
     * Disable
     *
     * @public
     */
    disable() {
        this.active = false;
    }

    /**
     * 处理键盘事件
     *
     * @public
     * @param {string} type 事件类型
     * @param {Event} e 事件参数
     */
    process(type, e) {
        if (!this.active) {
            return;
        }

        let key = e.key;

        // 处理光标事件
        if (ARROW_KEYS.indexOf(key) >= 0) {
            key = key.replace('Arrow', '');
            key = key.charAt(0).toLowerCase() + key.substring(1);
            e.preventDefault();
        }

        this.emit(type, key);
    }
}
