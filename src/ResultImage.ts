/**
 * ResultImage class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.18
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";
import { Point } from "./PointI";

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
    private makeCircle = (width: number): Set<Point> => {
        let x = width / 2;
        let y = width / 2;
        let r = width / 2;
        let i, angle, x1, y1;

        let matrix = new Array(width + 1).fill(1);

        let set = new Set<{ x: number; y: number }>();

        for (let i = 0; i < width + 1; ++i) {
            matrix[i] = new Array(width + 1).fill(1);
        }

        for (i = 0; i < 360; i += 1) {
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
     * Draw a black and white image from an original source
     * @param canvasImage HTML Canvas tag from which original image is taken
     * @return Array<number> densityPixel stats according to grayscaled image
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawImage = (bits: Array<number>, width: number, height: number, originalImage: ImageData): void => {
        this.getImageProcessingOptions();
        let circle = this.makeCircle(this.cellSize);

        this.canvas.width = width;
        this.canvas.height = height;

        let image = this.Get1DTo2DArray(bits, width, height);
        let ctn = 0;

        let arrayCircles = new Array<Point>();

        this.context.putImageData(originalImage, 0, 0);

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {

                // Check if circle
                let pixel = 0;
                for (let pointCircle of circle.values()) {
                    if (pointCircle.x + j < height && pointCircle.y + i < width) {
                        if (image[pointCircle.x + j][pointCircle.y + i] == 1) {
                            pixel++;
                        }
                    }
                }

                if (pixel > circle.size * ResultImage.RATIO_DETECTION) {

                    let containsCircle: boolean = arrayCircles.some((circle : {x: number, y: number}) => {
                        return Math.abs(circle.x - i) < this.cellSize && Math.abs(circle.y - j) < this.cellSize;
                    });

                    if(!containsCircle) {
                        arrayCircles.push({x: i, y: j});
                        ctn++;
                        j += this.cellSize;
                        console.log(`Circle detected on (${i + this.cellSize / 2},${j + this.cellSize / 2})`);
                    }
                }
            }
        }

        this.context.fillStyle = "red";
        arrayCircles.forEach((circle: Point) => {
            this.context.fillText("x", circle.x + (this.cellSize / 2), circle.y + (this.cellSize / 2), 20);
        });

        (<HTMLSpanElement>document.getElementById("numberWhiteBloodCells")).textContent = ctn.toString();
    }
}