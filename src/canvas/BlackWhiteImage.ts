/**
 * BlackWhiteImage class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.20
 * @version 2020.06.20
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";
import { Slider } from "../components/Slider";

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
     * @return binary image array
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch> 
     */
    public getBinaryUnits = (): Array<number> => {
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
     * @return densityPixel stats according to grayscaled image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = (canvasImage: HTMLCanvasElement, sliderLimitMin: Slider, sliderLimitMax: Slider): void => {
        var inputContext = canvasImage.getContext("2d");
        var imageData = inputContext.getImageData(0, 0, canvasImage.width, canvasImage.height);
        var data = imageData.data;

        var arraylength = canvasImage.width * canvasImage.height * 4;

        let limitMin: number = sliderLimitMin.getValue();
        let limitMax: number = sliderLimitMax.getValue();

        for (var i = arraylength - 1; i > 0; i -= 4) {
            let gray: number = 0;

            if (data[i - 1] >= limitMin && data[i - 1] <= limitMax) {
                gray = 0;
            } else {
                gray = 255;
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