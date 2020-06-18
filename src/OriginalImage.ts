/**
 * OriginalImage class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";

/**
 * OriginalImage class to draw a source image in a canvas
 */
export class OriginalImage extends Canvas {

    /**
     * Instanciate a new OriginalImage
     * @param idCanvasChart id canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
    }

    public getOriginalImage = () : ImageData => {
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw an image in a canvas
     * @param buffer buffer image source
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = async (buffer: string | ArrayBuffer | HTMLImageElement) => {

        return new Promise((resolve, reject) => {

            if (buffer instanceof HTMLImageElement) {
                var scaled = this.getScaledDim(buffer.width, buffer.height);
                this.context.canvas.width = scaled.width;
                this.context.canvas.height = scaled.height;
                this.context.drawImage(buffer, 0, 0, this.context.canvas.width, this.context.canvas.height);
                resolve();
            } else {
                let img: any = new Image()
                img.onload = () => {

                    var scaled = this.getScaledDim(img.width, img.height);
                    this.context.canvas.width = scaled.width;
                    this.context.canvas.height = scaled.height;

                    this.context.drawImage(img, 0, 0, this.context.canvas.width, this.context.canvas.height);
                    resolve();
                }
                img.src = buffer;
            }
        });
    }
}