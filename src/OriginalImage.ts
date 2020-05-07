/**
 * 
 */

import { Canvas } from "./AbstractChart";

export class OriginalImage extends Canvas {

    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
    }

    public drawImage = async (buffer: string | ArrayBuffer) => {

        return new Promise((resolve, reject) => {
            let img: any = new Image()
            img.onload = () => {

                var scaled = this.getScaledDim(img.width, img.height);
                this.context.canvas.width = scaled.width;
                this.context.canvas.height = scaled.height;

                this.context.drawImage(img, 0, 0, this.context.canvas.width, this.context.canvas.height);
                resolve();
            }
            img.src = buffer;
        });
    }
}