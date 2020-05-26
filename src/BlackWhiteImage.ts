/**
 * BlackWhiteImage class
 */

// Imports
import { Canvas } from "./Canvas";

/**
 * BlackWhiteImage class to define a canvas drawing a grayscale image
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class BlackWhiteImage extends Canvas {

    // Properties
    private arrayRgbValues: Uint8ClampedArray;
    private arrayBinaryValues: Array<number>;

    /**
     * Instanciate a new BlackWhiteImage canvas
     * @param idCanvasChart id concerned canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
    }

    /**
     * Get binary values [0; 1] from array rgb values [0; 255]
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch> 
     */
    public getBinaryUnits = () => {
        this.arrayBinaryValues = new Array<number>();

        for (let i = 0; i < this.arrayRgbValues.length; i++) {

            if (i % 4 == 0) {
                this.arrayBinaryValues.push(this.arrayRgbValues[i] == 255 ? 0 : 1);
            }
        }

        return this.arrayBinaryValues;
    }

    /**
     * Draw a black and white image from an original source
     * @param canvasImage HTML Canvas tag from which original image is taken
     * @return Array<number> densityPixel stats according to grayscaled image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = (canvasImage: HTMLCanvasElement, limit: number): void => {
        var inputContext = canvasImage.getContext("2d");
        var imageData = inputContext.getImageData(0, 0, canvasImage.width, canvasImage.height);
        var data = imageData.data;

        var arraylength = canvasImage.width * canvasImage.height * 4;

        for (var i = arraylength - 1; i > 0; i -= 4) {
            let gray: number = 0;

            if (data[i - 1] > limit) {

                gray = 255;
            } else {
                gray = 0;
            }

            data[i - 3] = gray;
            data[i - 2] = gray;
            data[i - 1] = gray;
        }

        // Store grayscale Image (32 bits pixel)
        this.arrayRgbValues = data;

        //Display the output image
        this.context.canvas.width = canvasImage.width;
        this.context.canvas.height = canvasImage.height;
        this.context.putImageData(imageData, 0, 0);
    }
}