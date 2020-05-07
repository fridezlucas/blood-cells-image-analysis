/**
 * Image Analyser class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

import { SpectrumChart } from "./SpectrumChart";
import CanvasI from "./CanvasI";
import { Canvas } from "./AbstractChart";
import { OriginalImage } from "./OriginalImage";
import { BlackWhiteImage } from "./BlackWhiteImage";

export class Analyser {

    private originalImage: OriginalImage;
    private blackWhiteImage: BlackWhiteImage;
    private spectrumChart: SpectrumChart;

    private ddlImages: HTMLSelectElement;
    private sliderGrayscaleLimit: HTMLInputElement;
    private inputFile: HTMLInputElement;

    public constructor(lstCanvas: CanvasI, idDdlImage: string, idSlider: string, idFileInput: string) {

        // Canvas
        this.originalImage = new OriginalImage(lstCanvas.idCanvasOriginal);
        this.blackWhiteImage = new BlackWhiteImage(lstCanvas.idCanvasBW);
        this.spectrumChart = new SpectrumChart(lstCanvas.idCanvasChart);
        // canvasprocessing§
        // canvasresult

        // Interactable components
        this.ddlImages = <HTMLSelectElement>document.getElementById(idDdlImage);
        this.sliderGrayscaleLimit = <HTMLInputElement>document.getElementById(idSlider);
        this.inputFile = <HTMLInputElement>document.getElementById(idFileInput);

        this.createEvents();
    }

    /**
     * Clear all canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private clearAllCanvas = () => {
        [this.originalImage, this.blackWhiteImage, this.spectrumChart].map((canvas: Canvas) => {
            canvas.clear();
        })
    }

    private changeImageDdl = () => {

    }

    private changeImageFileInput = (e: any) => {
        console.log("OK");

        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onloadend = () => {
            this.analyse(reader.result);
        }

        reader.readAsDataURL(file);
    }

    private changeGrayscaleLimit = () => {
        // chartBlackWhite class => set limit
    }

    private createEvents = (): void => {
        this.inputFile.addEventListener('change', this.changeImageFileInput, false);
    }

    public analyse = async (buffer: string | ArrayBuffer) => {
        this.clearAllCanvas();
        await this.originalImage.drawImage(buffer);
        let arrayDensity: Array<number> = this.blackWhiteImage.drawImage(this.originalImage.getCanvas());
        this.spectrumChart.drawChart(arrayDensity);
    }
}