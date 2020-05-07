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

    /**
     * Draw an image in a canvas
     * @param buffer buffer image source
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
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