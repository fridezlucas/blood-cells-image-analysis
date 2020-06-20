/**
 * ResultImage class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.20
 * @version 2020.06.20
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";
import { Point } from "../interfaces/PointI";

/**
 * ProcessingImage class to define a canvas drawing a grayscale image
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class ResultImage extends Canvas {

    // Properties
    private cellSize: number;

    // Constants
    private static readonly RATIO_DETECTION: number = 0.9;

    /**
     * Instanciate a new ProcessingImage canvas
     * @param idCanvasChart id concerned canvas
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
    }

    /**
     * Get image processing option from User view
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private getImageProcessingOptions = (): void => {
        this.cellSize = parseInt((<HTMLInputElement>document.getElementById("txtCellSize")).value);
    }

    /**
     * Make a circle matrix
     * 
     * @param width width of square matrix containing circle
     * 
     * @return set of points that forms the circle
     */
    private makeCircleWindow = (width: number): Set<Point> => {
        let x = width / 2;
        let y = width / 2;
        let r = width / 2;
        let angle: number;
        let x1: number;
        let y1: number;

        let matrix = new Array(width + 1).fill(1);

        let set = new Set<{ x: number; y: number }>();

        for (let i = 0; i < width + 1; ++i) {
            matrix[i] = new Array(width + 1).fill(1);
        }

        for (let i = 0; i < 360; i += 1) {
            angle = i;
            x1 = r * Math.cos(angle * Math.PI / 180);
            y1 = r * Math.sin(angle * Math.PI / 180);

            let ElX = ~~(Math.round(x + x1));
            let ElY = ~~(Math.round(y + y1));

            matrix[ElX][ElY] = 0;
            set.add({ x: ElX, y: ElY });

        }


        return set;
    }

    /**
     * Transform a 1 dimension array image into a 2 dimensions array image
     * It is much easier to work with a 2d array image
     * 
     * @param bits binary image as a 1D array
     * @param width width of image
     * @param height height of image
     * 
     * @return Image in a 2D array representation
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private Get1DTo2DArray = (bits: Array<number>, width: number, height: number): Array<Array<number>> => {

        let image2D = new Array(height);

        for (let col = 0; col < height; ++col) {
            image2D[col] = Array(width);
        }

        let i = 0;
        for (let r = 0; r < height; r++) {

            for (let c = 0; c < width; c++) {
                image2D[r][c] = bits[i++];
            }
        }

        return image2D;
    }

    /**
     * Mark all cells on canvas with a 'x' character
     * 
     * @param arrayCircles array of cells center points
     * @param cellsCounter number of cells
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private markCellsOnCanvas = (arrayCircles: Point[], cellsCounter: number): void => {
        this.context.fillStyle = "red";
        arrayCircles.forEach((c: Point) => {
            this.context.fillText("x", c.x + (this.cellSize / 2), c.y + (this.cellSize / 2), 20);
        });
        (<HTMLSpanElement>document.getElementById("numberWhiteBloodCells")).textContent = cellsCounter.toString();
    }

    /**
     * 
     * @param circle Set of point to check for each window detection
     * @param row current row to check in image
     * @param height image height
     * @param col current col to check in image
     * @param width image width
     * @param image image in a 2D representation
     * 
     * @return number of correct pixels for circle window
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private countCorrectPixelsForWindow = (circle: Set<Point>, row: number, height: number, col: number, width: number, image: number[][]) : number => {
        let correctPixels: number = 0;
        for (let pointCircle of circle.values()) {
            if (pointCircle.x + row < height && pointCircle.y + col < width) {
                // Must equals 1 and not 0 because the image processing works with white pixels for shapes
                // The values are inverted when Image processing is done (0 => 1; 1 => 0)
                if (image[pointCircle.x + row][pointCircle.y + col] == 1) {
                    correctPixels++;
                }
            }
        }
        return correctPixels;
    }

    /**
     * Detect cells and mark them on image
     * 
     * @param width image width
     * @param height image height
     * @param circle set of point to check for each window detection
     * @param image binary image in a 2D representation to analyse
     * @param arrayCircles array of center cells detected
     * @param cellsCounter counter of detected cells
     * 
     * @return number of detected cells
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private detectCells = (width: number, height: number, circle: Set<Point>, image: number[][], arrayCircles: Point[], cellsCounter: number) : number => {
        // Iterate through each pixel to detect a circle
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {

                // Check if circle
                let correctPixels: number = this.countCorrectPixelsForWindow(circle, j, height, i, width, image);

                // If pixels are <RATIO_DETECTION>% same with circle matrix; it is a cell !
                if (correctPixels > circle.size * ResultImage.RATIO_DETECTION) {
                    // Check if cell is already detected
                    let containsCircle: boolean = arrayCircles.some((c: {
                        x: number;
                        y: number;
                    }) => {
                        return Math.abs(c.x - i) < this.cellSize && Math.abs(c.y - j) < this.cellSize;
                    });

                    // If cell is not detected : store it in array and move window detection by cellSize on the right
                    if (!containsCircle) {
                        arrayCircles.push({ x: i, y: j });
                        cellsCounter++;
                        j += this.cellSize;
                    }
                }
            }
        }
        return cellsCounter;
    }

    /**
     * Draw a black and white image from an original source
     * @param canvasImage HTML Canvas tag from which original image is taken
     * @return Array<number> densityPixel stats according to grayscaled image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = (bits: Array<number>, width: number, height: number, originalImage: ImageData): void => {
        // Prepare canvas and get settings from UI
        this.getImageProcessingOptions();
        this.canvas.width = width;
        this.canvas.height = height;
        this.context.putImageData(originalImage, 0, 0);

        // Prepare circle matrix
        let circle = this.makeCircleWindow(this.cellSize);

        // Prepare analyze on ResultImage
        let image = this.Get1DTo2DArray(bits, width, height);
        let cellsCounter = 0;
        let arrayCircles = new Array<Point>();

        cellsCounter = this.detectCells(width, height, circle, image, arrayCircles, cellsCounter);

        this.markCellsOnCanvas(arrayCircles, cellsCounter);
    }
}