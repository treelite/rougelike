/**
 * @file Curation
 * @author treelite(c.xinle@gmail.com)
 */

import Effect from '../effect/Effect';
import FadeIn from '../effect/FadeIn';
import FadeOut from '../effect/FadeOut';
import EventEmitter from '../util/EventEmitter';
import * as renderHelper from '../util/renderHelper';

export default class Curation extends EventEmitter {

    constructor(ctx, width, height, duration) {
        super();
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.display = false;
        this.duration = duration * 1000;
    }

    show(msg) {
        this.msg = msg;
        this.display = true;
    }

    hide() {
        this.display = false;
    }

    fadeIn(msg) {
        this.show(msg);
        let effect = this.effect = new FadeIn(this.ctx, this.duration);
        return new Promise(resolve => effect.once('end', resolve));
    }

    fadeOut(delayTime) {
        if (delayTime) {
            return new Promise(resolve => {
                setTimeout(() => this.fadeOut().then(resolve), delayTime * 1000);
            });
        }
        let effect = this.effect = new FadeOut(this.ctx, this.duration);
        return new Promise(resolve => {
            effect.once('end', () => {
                this.hide();
                resolve();
            });
        });
    }

    @Effect.apply('effect')
    @renderHelper.stashProperties('font', 'textAlign', 'fillStyle')
    render(deltaTime) {
        if (!this.display) {
            return;
        }

        let ctx = this.ctx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#FFF';
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.msg, this.width / 2, this.height / 2);
    }

}
