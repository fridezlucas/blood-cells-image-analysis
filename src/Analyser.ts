/**
 * Image Analyser class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { SpectrumChart } from "./SpectrumChart";
import CanvasI from "./CanvasI";
import { Canvas } from "./AbstractChart";
import { OriginalImage } from "./OriginalImage";
import { BlackWhiteImage } from "./BlackWhiteImage";

/**
 * Analyser class
 * 
 * Contains all canvas to show each step of white blood cells analysing
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class Analyser {

    private originalImage: OriginalImage;
    private blackWhiteImage: BlackWhiteImage;
    private spectrumChart: SpectrumChart;

    private ddlImages: HTMLSelectElement;
    private sliderGrayscaleLimit: HTMLInputElement;
    private inputFile: HTMLInputElement;

    /**
     * Instanciate a new Analyser
     * @param lstCanvas Canvas id list
     * @param idDdlImage select id
     * @param idSlider slider id
     * @param idFileInput file input id
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
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

        this.initEvents();
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

    /**
     * Change image to analyse with included images in HTML
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private changeImageDdl = () => {

    }

    /**
     * Upload another image to analyse it
     * 
     * @param e Changed Image event
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private changeImageFileInput = (e: Event) => {
        var reader = new FileReader();
        var file = (<HTMLInputElement>e.target).files[0];

        reader.onloadend = () => {
            this.analyse(reader.result);
        }

        reader.readAsDataURL(file);
    }

    /**
     * Change grayscale limit to do black white transformation
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private changeGrayscaleLimit = () => {
        // chartBlackWhite class => set limit
    }

    /**
     * Init all events according to White blood cells analyser
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private initEvents = (): void => {
        this.inputFile.addEventListener('change', this.changeImageFileInput, false);
    }

    public analyse = async (buffer: string | ArrayBuffer) => {
        this.clearAllCanvas();
        await this.originalImage.drawImage(buffer);
        let arrayDensity: Array<number> = this.blackWhiteImage.drawImage(this.originalImage.getCanvas());
        this.spectrumChart.drawChart(arrayDensity);
    }
}