/**
 * @file FadeIn
 * @author treelite(c.xinle@gmail.com)
 */

import Effect from './Effect'

export default class FadeIn extends Effect {

    constructor(ctx, duration) {
        super(ctx, duration, 'globalAlpha');
    }

    apply() {
        this.ctx.globalAlpha = Math.min(this.time / this.duration, 1.0);
    }
}
