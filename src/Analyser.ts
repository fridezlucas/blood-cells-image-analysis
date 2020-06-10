/**
 * Image Analyser class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { SpectrumChart } from "./SpectrumChart";
import CanvasI from "./CanvasI";
import { Canvas } from "./Canvas";
import { OriginalImage } from "./OriginalImage";
import { GrayscaleImage } from "./GrayscaleImage";
import { BlackWhiteImage } from "./BlackWhiteImage";
import { ProcessingImage } from "./ProcessingImage";

/**
 * Analyser class
 * 
 * Contains all canvas to show each step of white blood cells analysing
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class Analyser {

    private originalImage: OriginalImage;
    private grayscaleImage: GrayscaleImage;
    private bwImage: BlackWhiteImage;
    private spectrumChart: SpectrumChart;
    private processingChart: ProcessingImage;

    private ddlImages: HTMLSelectElement;
    private sliderGrayscaleLimitMin: HTMLInputElement;
    private sliderGrayscaleLimitMax: HTMLInputElement;
    private sliderLimitGraph: HTMLInputElement;
    private inputFile: HTMLInputElement;

    // Options
    private mustApplyGrayscaleLimit: boolean;
    private grayscaleLimitMin: number;
    private grayscaleLimitMax: number;
    private limitGraph: number;

    /**
     * Instanciate a new Analyser
     * @param lstCanvas Canvas id list
     * @param idDdlImage select id
     * @param idSliderMin sliderMin id
     * @param idSliderMax sliderMax id
     * @param idFileInput file input id
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(lstCanvas: CanvasI, idDdlImage: string, idSliderMin: string, idSliderMax: string, idMaxGraph: string, idFileInput: string) {

        // Canvas
        this.originalImage = new OriginalImage(lstCanvas.idCanvasOriginal);
        this.grayscaleImage = new GrayscaleImage(lstCanvas.idCanvasGray);
        this.bwImage = new BlackWhiteImage(lstCanvas.idCanvasBW)
        this.spectrumChart = new SpectrumChart(lstCanvas.idCanvasChart);
        this.processingChart = new ProcessingImage(lstCanvas.idCanvasProcessing);
        // canvasresult

        // Interactable components
        this.ddlImages = <HTMLSelectElement>document.getElementById(idDdlImage);
        this.sliderGrayscaleLimitMin = <HTMLInputElement>document.getElementById(idSliderMin);
        this.sliderGrayscaleLimitMax = <HTMLInputElement>document.getElementById(idSliderMax);
        this.sliderLimitGraph = <HTMLInputElement>document.getElementById(idMaxGraph);
        this.inputFile = <HTMLInputElement>document.getElementById(idFileInput);

        // Options
        this.mustApplyGrayscaleLimit = false;
        this.grayscaleLimitMin = parseInt(this.sliderGrayscaleLimitMin.value);
        this.grayscaleLimitMax = parseInt(this.sliderGrayscaleLimitMax.value);
        this.limitGraph = parseInt(this.sliderLimitGraph.value);

        this.initEvents();
    }

    /**
     * Clear all canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private clearAllCanvas = () => {
        [this.originalImage, this.grayscaleImage, this.spectrumChart, this.processingChart].map((canvas: Canvas) => {
            canvas.clear();
        })
    }

    /**
     * Change image to analyse with included images in HTML
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private changeImageDdl = (e: Event) => {
        // (<HTMLSelectElement>e.target).value => select value
        let index: number = parseInt((<HTMLSelectElement>e.target).value) - 1;
        this.analyse(<HTMLImageElement>document.querySelectorAll("#images img")[index]);
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
    private changeGrayscaleLimitMin = (e: Event) => {
        this.grayscaleLimitMin = parseInt((<HTMLInputElement>e.target).value);
        this.process();
    }

    /**
     * Change grayscale limit to do black white transformation
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private changeGrayscaleLimitMax = (e: Event) => {
        this.grayscaleLimitMax = parseInt((<HTMLInputElement>e.target).value);
        this.process();
    }

    /**
     * Change grayscale limit to do black white transformation
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private changeLimitGraph = (e: Event) => {
        this.limitGraph = parseInt((<HTMLInputElement>e.target).value);
        this.process();
    }

    /**
     * Init all events according to White blood cells analyser
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private initEvents = (): void => {
        this.inputFile.addEventListener('change', this.changeImageFileInput, false);
        this.ddlImages.addEventListener("change", this.changeImageDdl);
        this.sliderGrayscaleLimitMin.addEventListener("change", this.changeGrayscaleLimitMin);
        this.sliderGrayscaleLimitMax.addEventListener("change", this.changeGrayscaleLimitMax);
        this.sliderLimitGraph.addEventListener("change", this.changeLimitGraph);
        this.sliderGrayscaleLimitMin.addEventListener("input", (e: Event) => {
            (<HTMLInputElement>e.target).parentElement.querySelector("span").textContent = (<HTMLInputElement>e.target).value;
        });
        this.sliderGrayscaleLimitMax.addEventListener("input", (e: Event) => {
            (<HTMLInputElement>e.target).parentElement.querySelector("span").textContent = (<HTMLInputElement>e.target).value;
        });
        this.sliderLimitGraph.addEventListener("input", (e: Event) => {
            (<HTMLInputElement>e.target).parentElement.querySelector("span").textContent = (<HTMLInputElement>e.target).value;
        });
    }

    /**
     * Analyse image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public analyse = async (buffer: string | ArrayBuffer | HTMLImageElement) => {
        this.clearAllCanvas();
        await this.originalImage.drawImage(buffer);
        this.process();
    }

    /**
     * Process image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private process = () => {
        let arrayDensity: Array<number> = this.grayscaleImage.drawImage(this.originalImage.getCanvas());
        this.bwImage.drawImage(this.grayscaleImage.getCanvas(), this.grayscaleLimitMin, this.grayscaleLimitMax);
        this.spectrumChart.drawChart(arrayDensity, this.grayscaleLimitMin, this.grayscaleLimitMax, this.limitGraph);
        this.processingChart.drawImage(this.bwImage.getBinaryUnits(), this.bwImage.getCanvas().width, this.bwImage.getCanvas().height);
        console.log("Analyser -> privateprocess -> this.bwImage.getBinaryUnits()", this.bwImage.getBinaryUnits())
    }
}