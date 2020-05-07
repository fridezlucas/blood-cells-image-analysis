/**
 * Image Analyser class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

import { SpectrumChart } from "./SpectrumChart";
import CanvasI from "./CanvasI";
import { Canvas } from "./AbstractChart";

export class Analyser {

    private spectrumChart: SpectrumChart;
    private ddlImages: HTMLUListElement;
    private sliderGrayscaleLimit: HTMLInputElement;
    private inputFile: HTMLInputElement;

    public constructor(lstCanvas: CanvasI, idDdlImage: string, idSlider: string, idFileInput: string) {
        // Canvas
        // canvasoriginal
        // canvasblackwhite
        this.spectrumChart = new SpectrumChart(lstCanvas.idCanvasChart);
        // canvasprocessing§
        // canvasresult

        // Interactable components
        this.ddlImages = <HTMLUListElement>document.getElementById(idDdlImage);
        this.sliderGrayscaleLimit = <HTMLInputElement>document.getElementById(idSlider);
        this.inputFile = <HTMLInputElement>document.getElementById(idFileInput);

        this.createEvents();
    }

    /**
     * Clear all canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private clearCanvas = () => {
        [this.spectrumChart].map((canvas: Canvas) => {
            canvas.clear();
        })
    }

    private changeImageDdl = () => {

    }

    private changeImageFileInput = () => {

    }

    private changeGrayscaleLimit = () => {
        // chartBlackWhite class => set limit
    }

    private createEvents = (): void => {

    }

    public analyse = () => {
        // todo
    }

    /**
     * Clear all canvas before rendering another image !
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private clearAllCanvas = () => {
        // todo...
    }
}