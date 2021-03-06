/**
 * Image Analyser class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.20
 * @version 2020.06.20
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { SpectrumChart } from "./canvas/SpectrumChart";
import { CanvasI } from "./interfaces/CanvasI";
import { Canvas } from "./canvas/Canvas";
import { OriginalImage } from "./canvas/OriginalImage";
import { GrayscaleImage } from "./canvas/GrayscaleImage";
import { BlackWhiteImage } from "./canvas/BlackWhiteImage";
import { ProcessingImage } from "./canvas/ProcessingImage";
import { Slider } from "./components/Slider";
import { ResultImage } from "./canvas/ResultImage";

/**
 * Analyser class
 * 
 * Contains all canvas to show each step of white blood cells analysing
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class Analyser {

    // Canvas properties
    private originalImage: OriginalImage;
    private grayscaleImage: GrayscaleImage;
    private bwImage: BlackWhiteImage;
    private spectrumChart: SpectrumChart;
    private processingImage: ProcessingImage;
    private resultImage: ResultImage;

    // Option properties
    private ddlImages: HTMLSelectElement;
    private sliderGrayscaleLimitMin: Slider;
    private sliderGrayscaleLimitMax: Slider;
    private sliderLimitGraph: Slider;
    private inputFile: HTMLInputElement;

    /**
     * Instanciate a new Analyser
     * @param lstCanvas Canvas id list
     * @param idDdlImage select id
     * @param idSliderMin sliderMin id
     * @param idSliderMax sliderMax id
     * @param idMaxGraph sliderMaxWhite id
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
        this.processingImage = new ProcessingImage(lstCanvas.idCanvasProcessing);
        this.resultImage = new ResultImage(lstCanvas.idCanvasResult);

        // Interactable components
        this.ddlImages = <HTMLSelectElement>document.getElementById(idDdlImage);
        this.sliderGrayscaleLimitMin = new Slider(idSliderMin, this.process);
        this.sliderGrayscaleLimitMax = new Slider(idSliderMax, this.process);
        this.sliderLimitGraph = new Slider(idMaxGraph, this.process);
        this.inputFile = <HTMLInputElement>document.getElementById(idFileInput);

        this.initEvents();
    }

    /**
     * Clear all canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private clearAllCanvas = () => {
        [this.originalImage, this.grayscaleImage, this.spectrumChart, this.processingImage, this.resultImage].forEach((canvas: Canvas) => {
            canvas.clear();
        })
    }

    /**
     * Change image to analyse with included images in HTML
     * 
     * @param e Change event with dropdown list
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

        // Analyse image when fully loaded
        reader.onloadend = () => {
            this.analyse(reader.result);
        }

        reader.readAsDataURL(file);
    }

    /**
     * Init all events according to White blood cells analyser
     * On image input (or change with dropdown list) : analyze it !
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private initEvents = (): void => {
        this.inputFile.addEventListener('change', this.changeImageFileInput, false);
        this.ddlImages.addEventListener("change", this.changeImageDdl);

        (<HTMLInputElement>document.getElementById("cbApplyErosion")).addEventListener("change", this.process);
        (<HTMLInputElement>document.getElementById("cbApplyDilation")).addEventListener("change", this.process);
    }

    /**
     * Analyse image (when User changes image)
     * 
     * @param buffer Original image to draw and analyse
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public analyse = async (buffer: string | ArrayBuffer | HTMLImageElement) => {
        this.clearAllCanvas();
        await this.originalImage.drawImage(buffer);
        this.process();
    }

    /**
     * Process image (when User change options)
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private process = () => {
        let limitGraph: number = this.sliderLimitGraph.getValue();

        // Processing
        let arrayDensity: Array<number> = this.grayscaleImage.drawImage(this.originalImage.getCanvas());
        this.spectrumChart.drawChart(arrayDensity, this.sliderGrayscaleLimitMin, this.sliderGrayscaleLimitMax, limitGraph);
        this.bwImage.drawImage(this.grayscaleImage.getCanvas(), this.sliderGrayscaleLimitMin, this.sliderGrayscaleLimitMax);
        this.processingImage.drawImage(this.bwImage.getBinaryUnits(), this.bwImage.getCanvas().width, this.bwImage.getCanvas().height);
        this.resultImage.drawImage(this.bwImage.getBinaryUnits(),this.bwImage.getCanvas().width, this.bwImage.getCanvas().height, this.originalImage.getOriginalImage());
    }
}