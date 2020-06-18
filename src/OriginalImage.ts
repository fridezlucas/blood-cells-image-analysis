/**
 * OriginalImage class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.18
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
     * @return {ImageData} OriginalImage
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public getOriginalImage = () : ImageData => {
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw an image in a canvas
     * @param buffer buffer image source
     * 
     * @return {Promise} promise to wait until parallel drawing is finished to continue analyze
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = async (buffer: string | ArrayBuffer | HTMLImageElement): Promise<any> => {

        return new Promise((resolve, reject) => {

            // Image is already in DOM (Change with dropdown list)
            if (buffer instanceof HTMLImageElement) {
                this.adaptAppearance(buffer);
                this.context.drawImage(buffer, 0, 0, this.context.canvas.width, this.context.canvas.height);
                resolve();
            } else {
                // Image is loaded by file input : must load it before analyze it
                let img: any = new Image()
                img.onload = () => {
                    this.adaptAppearance(img);
                    this.context.drawImage(img, 0, 0, this.context.canvas.width, this.context.canvas.height);
                    resolve();
                }
                img.src = buffer;
            }
        });
    }
}