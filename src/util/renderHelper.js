/**
 * @file renderHelper
 * @author treelite(c.xinle@gmail.com)
 */

let propertyStack = [];

/**
 * 暂存渲染属性
 *
 * @public
 * @param {CanvasRenderingContext2D} ctx context
 * @param {...string} properties 属性名
 */
export function push(ctx, ...properties) {
    let data = {};
    for (let key of properties) {
        data[key] = ctx[key];
    }
    propertyStack.push(data);
}

/**
 * 恢复渲染属性
 *
 * @public
 * @param {CanvasRenderingContext2D} ctx context
 */
export function pop(ctx) {
    let data = propertyStack.pop();
    if (!data) {
        return;
    }

    for (let key of Object.keys(data)) {
        ctx[key] = data[key];
    }
}

/**
 * 保护上下文渲染属性
 *
 * @public
 * @param {...string} properties 属性名
 * @return {Function}
 */
export function stashProperties(...properties) {
    return function (target, key, descriptor) {
        let method = descriptor.value;
        descriptor.value = function (...args) {
            push(this.ctx, properties);
            method.apply(this, properties);
            pop(this.ctx);
        };
        return descriptor;
    };
}
