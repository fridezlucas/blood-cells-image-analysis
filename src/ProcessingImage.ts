/**
 * ProcessingImage class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.18
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";
declare var Morph: any;

/**
 * ProcessingImage class to define a canvas drawing a grayscale image
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class ProcessingImage extends Canvas {

    // Properties
    private arrayRgbValues: Uint8ClampedArray;
    private arrayBinaryValues: Array<number>;

    private applyErosion: boolean;
    private applyDilation: boolean;
    private cellSize: number;

    /**
     * Instanciate a new ProcessingImage canvas
     * @param idCanvasChart id concerned canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
    }

    private getImageProcessingOptions = (): void => {
        this.applyErosion = (<HTMLInputElement>document.getElementById("cbApplyErosion")).checked;
        this.applyDilation = (<HTMLInputElement>document.getElementById("cbApplyDilation")).checked;
        this.cellSize = ~~(<HTMLInputElement>document.getElementById("txtCellSize")).value;
    }

    /**
     * Get binary values [0; 1] from array rgb values [0; 255]
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch> 
     */
    public getRGBValues = (bits: Array<number>, width: number, height: number) => {
        let rgbaImage: Uint32Array = new Uint32Array(width * height);

        for (var i = 0; i < rgbaImage.length; i++) {
            rgbaImage[i] = bits[i] == 0 ? 0xffffffff : 0xff000000;
        }

        this.context.putImageData(new ImageData(new Uint8ClampedArray(rgbaImage.buffer), width, height), 0, 0);

        return rgbaImage;
    }

    /**
     * Draw a black and white image from an original source
     * @param canvasImage HTML Canvas tag from which original image is taken
     * @return Array<number> densityPixel stats according to grayscaled image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = (bits: Array<number>, width: number, height: number): void => {
        this.getImageProcessingOptions();

        let t = new Morph(width, height, bits);
        this.context.createImageData(width, height);

        if (this.applyErosion) {
            t.erodeWithElement();
        }
        if (this.applyDilation) {
            t.dilateWithElement();
        }

        
        this.canvas.width = width;
        this.canvas.height = height;
        this.getRGBValues(t.data, width, height);
    }
}