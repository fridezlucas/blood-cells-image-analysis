/**
 * Spectrum Chart class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

import { Canvas } from "./AbstractChart"; 

export class SpectrumChart extends Canvas {

    // Properties
    private arrayDensityPixels: Array<number>;

    /**
     * Construct a new SpectrumChart
     * @param idCanvasChart id of canvas to draw a spectrum chart
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
        this.arrayDensityPixels = new Array<number>();
    }

    /**
     * Draw Spectrum Chart
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawChart = () : void => {
        // draw grayscale image
    }


}