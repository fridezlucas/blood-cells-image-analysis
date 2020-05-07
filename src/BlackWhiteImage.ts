/**
 * 
 */

import { Canvas } from "./AbstractChart";

export class BlackWhiteImage extends Canvas {

    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
    }

    public drawImage = (canvasImage: HTMLCanvasElement): Array<number> => {
        console.log("OK BW");
        
        //Get the context for the loaded changechangechange
        var inputContext = canvasImage.getContext("2d");
        //get the image data;
        var imageData = inputContext.getImageData(0, 0, canvasImage.width, canvasImage.height);
        //Get the CanvasPixelArray
        var data = imageData.data;

        //Get length of all pixels in image each pixel made up of 4 elements for each pixel, one for Red, Green, Blue and Alpha
        var arraylength = canvasImage.width * canvasImage.height * 4;
        //Go through each pixel from bottom right to top left and alter to its gray equiv

        //Common formula for converting to grayscale.
        //gray = 0.3*R + 0.59*G + 0.11*B

        var density: any = [];
        for (let i = 0; i < 256; i++) {
            density[i] = 0;
        }

        for (var i = arraylength - 1; i > 0; i -= 4) {
            //R= i-3, G = i-2 and B = i-1
            //Get our gray shade using the formula
            var gray = 0.3 * data[i - 3] + 0.59 * data[i - 2] + 0.11 * data[i - 1];

            var limit: number = parseInt((<HTMLInputElement>document.getElementById("limit")).value);

            // if(gray > limit) {
            //     gray = 255;
            // } else {
            //     gray = 0;
            // }

            density[gray.toFixed(0)] = density[gray.toFixed(0)] + 1;


            data[i - 3] = gray;
            data[i - 2] = gray;
            data[i - 1] = gray;

        }

        //console.log(density, arraylength * arraylength);

        //chart(density);

        //Display the output image
        this.context.putImageData(imageData, 0, 0);

        return density;
    }
}