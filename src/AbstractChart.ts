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

    /**
     * Construct a new Canvas
     * @param idCanvas id of concerned canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvas: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(idCanvas);
        this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
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