/**
 * Abstract Chart class
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
        this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");

        this.dataMaxWidth = this.canvas.width;
        this.dataMaxHeight = this.canvas.height;
    }

    public getCanvas = (): HTMLCanvasElement => {
        return this.canvas;
    }

    public getContext = (): CanvasRenderingContext2D => {
        return this.context;
    }

    public getScaledDim = (imgWidth: any, imgHeight: any): any => {
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
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public adaptAppearance = () => {
        // adapt and keep aspect ratio
    }
}