/**
 * Abstract Chart class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.20
 * @version 2020.06.20
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

/**
 * Canvas class
 * 
 * Contains canvas DOM element and its 2D Context
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export abstract class Canvas {

    // Properties
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;

    private dataMaxWidth: number;
    private dataMaxHeight: number;

    /**
     * Construct a new Canvas
     * @param idCanvas id of concerned canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvas: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(idCanvas);
        this.context = this.canvas.getContext("2d");

        this.dataMaxWidth = this.canvas.width;
        this.dataMaxHeight = this.canvas.height;
    }

    /**
     * @return {HTMLCanvasElement} HTML Canvas element
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public getCanvas = (): HTMLCanvasElement => {
        return this.canvas;
    }

    /**
     * @return {CanvasRenderingContext2D} Context 2d of canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public getContext = (): CanvasRenderingContext2D => {
        return this.context;
    }

    /**
     * Get scaled dimensions of canvas
     * 
     * @param imgWidth width of image
     * @param imgHeight height of image
     * 
     * @return aspect ratio object `{ratio, width, height}`
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public getScaledDimensions = (imgWidth: number, imgHeight: number): { ratio: number, width: number, height: number } => {
        let scaled = {
            ratio: imgWidth / imgHeight,
            width: imgWidth,
            height: imgHeight
        }

        if (scaled.width > this.dataMaxWidth) {
            scaled.width = this.dataMaxWidth;
            scaled.height = scaled.width / scaled.ratio;
        }

        if (scaled.height > this.dataMaxHeight) {
            scaled.height = this.dataMaxHeight;
            scaled.width = scaled.height / scaled.ratio;
        }

        return scaled;
    }

    /**
     * Clear context's canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Adapt canvas' appearance (width/height) according to image
     * 
     * @param {HTMLImageElement} image to keep aspect ratio and dimensions
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public adaptAppearance = (image: HTMLImageElement) => {
        let scaled: { ratio: number, width: number, height: number } = this.getScaledDimensions(image.width, image.height);
        this.context.canvas.width = scaled.width;
        this.context.canvas.height = scaled.height;
    }
}