/**
 * @file 摄像机
 * @author treelite(c.xinle@gmail.com)
 */

export default class {

    constructor(options = {}) {
        this.ctx = options.ctx;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.viewWidth = options.viewWidth || 1;
        this.viewHeight = options.viewHeight || 1;
        this.screenWidth = options.screenWidth || 640;
        this.screenHeight = options.screenHeight || 480;

        let lockScale = !(options.lockScale === false);
        this.offsetX = this.offsetY = 0;
        this.widthScale = this.screenWidth / this.viewWidth;
        this.heightScale = this.screenHeight / this.viewHeight;
        if (lockScale) {
            let scale = Math.min(this.widthScale, this.heightScale);
            this.offsetX = (this.screenWidth - scale * this.viewWidth) / 2
            this.offsetY = (this.screenHeight - scale * this.viewHeight) / 2
            this.widthScale = this.heightScale = scale;
        }
    }

    shot(world) {
        let tiles = world.getAreaTiles(this.x, this.y, this.viewWidth, this.viewHeight);
        let ctx = this.ctx;

        for (let tile of tiles) {
            let x = (tile.x - this.x) * this.widthScale + this.offsetX;
            let y = (tile.y - this.y) * this.heightScale + this.offsetY;
            ctx.drawImage(
                tile.img,
                tile.sx, tile.sy,
                tile.sWidth, tile.sHeight,
                x, y,
                this.widthScale, this.heightScale
            );
        }
    }
}
