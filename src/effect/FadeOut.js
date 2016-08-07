/**
 * @file FadeOut
 * @author treelite(c.xinle@gmail.com)
 */

import Effect from './Effect'

export default class FadeOut extends Effect {

    constructor(ctx, duration) {
        super(ctx, duration, 'globalAlpha');
    }

    apply() {
        let t = this.duration - this.time;
        this.ctx.globalAlpha = Math.min(t / this.duration, 1.0);
    }
}
