/**
 * @file Scene
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from './util/EventEmitter';

let triggerAll = (tiles, fn) => tiles.filter(item => !!item.trigger).forEach(fn);

/**
 * Scene
 *
 * @class
 */
export default class Scene extends EventEmitter {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {number} width 场景宽度
     * @param {number} height 场景高度
     */
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
        this.map = new Array(width * height);
        this.actives = new Set();
    }

    /**
     * 场景坐标转化为场景数据索引
     *
     * @public
     * @param {number} x x
     * @param {number} y x
     * @return {number}
     */
    pos2Index(x, y) {
        // TODO 检查范围
        return x + this.width * y;
    }

    /**
     * 设置 Tile
     *
     * @public
     * @param {Tile} tile tile
     * @param {number} x x
     * @param {number} y y
     * @param {boolean=} silent Is silent
     */
    set(tile, x, y, silent) {
        let map = this.map;
        let index = this.pos2Index(x, y);
        let tiles = map[index] || [];
        let i = 0;
        for (let item; item = tiles[i]; i++) {
            if (tile.level < item.level || (tile.level === item.level && tile.z < item.z)) {
                break;
            }
        }
        tile.scene = this;
        tile.x = x;
        tile.y = y;
        tiles.splice(i, 0, tile);
        map[index] = tiles;

        if (tile.active) {
            this.actives.add(tile);
        }

        if (!silent) {
            triggerAll(tiles, item => item.meet(tile));
        }
    }

    /**
     * 删除 Tile
     *
     * @public
     * @param {Tile} tile tile
     * @return {boolean}
     */
    remove(tile) {
        if (tile.scene !== this) {
            return false;
        }
        let tiles = this.map[this.pos2Index(tile.x, tile.y)];
        let index = tiles.indexOf(tile);
        if (index >= 0) {
            tiles.splice(index, 1);
            tile.scene = null;
            if (tile.active) {
                this.actives.delete(tile);
            }
            return true;
        }
        return false;
    }

    /**
     * 更新场景
     *
     * @public
     * @param {number} deltaTime 间隔时间
     */
    update(deltaTime) {
        for (let tile of this.actives) {
            tile.update(deltaTime);
        }
    }

    /**
     * 移动角色
     *
     * @public
     * @param {Role} role 角色
     * @param {number} dx 相对位移 X
     * @param {number} dy 相对位移 Y
     */
    move(role, dx, dy) {
        let x = role.x + dx;
        let y = role.y + dy;
        let tiles = this.map[this.pos2Index(x, y)];
        let maxZ = tiles.filter(item => item.level === role.level).pop().z;

        triggerAll(tiles, item => role.meet(item));
        if (maxZ < role.z) {
            this.remove(role);
            this.set(role, x, y);
        }
    }

    /**
     * 获取区域 Tiles
     *
     * @public
     * @param {number} ox 起始 x 坐标
     * @param {number} oy 起始 y 坐标
     * @param {number} width 区域宽度
     * @param {number} height 区域高度
     * @return {Array}
     */
    getAreaTiles(ox, oy, width, height) {
        let total = width * height;
        let res = [];
        for (let i = 0; i < total; i++) {
            let index = this.pos2Index(ox + i % width, oy + Math.floor(i / width));
            res = res.concat(this.map[index] || []);
        }
        return res;
    }

}
