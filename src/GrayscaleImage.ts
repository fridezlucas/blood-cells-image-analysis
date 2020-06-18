/**
 * GrayscaleImage class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.18
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";

/**
 * GrayscaleImage class to define a canvas drawing a grayscale image
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class GrayscaleImage extends Canvas {

    /**
     * Instanciate a new GrayscaleImage canvas
     * @param idCanvasChart id concerned canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
    }

    /**
     * Draw a grayscaled image from an original source
     * @param canvasImage HTML Canvas tag from which original image is taken
     * @return Array<number> densityPixel stats according to grayscaled image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = (canvasImage: HTMLCanvasElement): Array<number> => {
        var inputContext = canvasImage.getContext("2d");
        var imageData = inputContext.getImageData(0, 0, canvasImage.width, canvasImage.height);
        var data = imageData.data;

        var arraylength = canvasImage.width * canvasImage.height * 4;

        // Create density array filled with 0
        var density: Array<number> = new Array<number>().fill(0);

        // Fill density array
        for (var i = arraylength - 1; i > 0; i -= 4) {
            //Common formula for converting to grayscale.
            //gray = 0.3*R + 0.59*G + 0.11*B
            let gray: number = 0.3 * data[i - 3] + 0.59 * data[i - 2] + 0.11 * data[i - 1];

            density[gray.toFixed(0)] = density[gray.toFixed(0)] + 1;

            data[i - 3] = gray;
            data[i - 2] = gray;
            data[i - 1] = gray;
        }

        //Display the output image
        this.context.canvas.width = canvasImage.width;
        this.context.canvas.height = canvasImage.height;
        this.context.putImageData(imageData, 0, 0);

        return density;
    }
}