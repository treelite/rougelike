/**
 * @file 资源加载器
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from './util/EventEmitter';

const MAX_PAIALLEL = 4;

const IMG_EXTS = ['png', 'jpg', 'gif'];
const TYPE_SCRIPT = 'script';
const TYPE_IMG = 'img';
const TYPE_UNKNOW = 'unknow';

function detectType(src) {
    let extname = src.split('.');
    extname = extname[extname.length - 1].toLowerCase();
    if (extname === 'js') {
        return TYPE_SCRIPT;
    }
    else if (IMG_EXTS.indexOf(extname) >= 0) {
        return TYPE_IMG;
    }
    return TYPE_UNKNOW;
}

let loader = {

    [TYPE_SCRIPT](src) {
        src = src.replace(/\.js$/, '');
        return System.import(src);
    },

    [TYPE_IMG](src) {
        return new Promise(resolve => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });
    }

};

/**
 * 资源对象
 *
 * @class
 */
class Resource {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {string} id ID
     * @param {string} src 资源地址
     */
    constructor(id, src) {
        this.id = id;
        this.src = src;
        this.type = detectType(src);
    }

    /**
     * 加载资源
     *
     * @public
     * @return {Promise}
     */
    load() {
        if (this.loading) {
            return this.loading;
        }
        let handle = loader[this.type];
        if (!handle) {
            throw new Error(`unknow resource: ${this.id} ${this.src}`);
        }
        this.loading = handle(this.src).then(data => this.data = data);
        return this.loading;
    }
}

/**
 * 资源数据
 *
 * @type {Map}
 */
let meta = new Map();

export function get(id) {
    let res = meta.get(id);
    if (!res) {
        throw new Error(`cannot found resource: ${id}`);
    }
    else if (!res.data) {
        throw new Error(`not load resource: ${id}`);
    }
    return res.data;
}

export function config(list) {
    for (let id of Object.keys(list)) {
        if (!meta.has(id)) {
            meta.set(id, new Resource(id, list[id]));
        }
    }
}

export function has(id) {
    return meta.has(id);
}

export function load(...ids) {
    let data = [];
    let resources = ids.map(id => meta.get(id)).filter(item => !!item);

    let loaded = 0;
    let total = resources.length;
    let process = new EventEmitter();

    function finish(res, index) {
        loaded++;
        process.emit('loaded', {num: loaded, total: total, data: res});
        data[index] = res;
        if (loaded >= total) {
            process.emit('complete', data);
        }
    }

    function next(index) {
        let items = resources.splice(0, MAX_PAIALLEL);
        if (!items.length) {
            return;
        }

        Promise
            .all(items.map((item, i) => item.load().then(res => finish(res, index + i))))
            .then(() => next(index + items.length));
    }

    if (resources.length) {
        next(0);
    }
    else {
        setTimeout(() => process.emit('complete', []), 0);
    }
    return process;
}
