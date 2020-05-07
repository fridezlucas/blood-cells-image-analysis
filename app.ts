/**
 * Algorithmes numériques
 * Mini Projet
 * 
 * @author  : Lucas Fridez
 * @date    : 2020.05.05
 * @version : 2020.05.05
 */

import { Chart } from 'chart.js';

function chart(data) {
    var lab = [];

    for (let i = 0; i < 256; i++) {
        lab.push(i);
    }

    var ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lab,
            datasets: [{
                label: 'Number of pixel',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 30
                    }
                }]
            }
        }
    });

    console.log(myChart.chartArea.left, myChart.chartArea.right, myChart.chartArea.right - myChart.chartArea.left)
}

/**
 * DOM is loaded, time to run mini project ! :-D
 */
document.addEventListener("DOMContentLoaded", () => {

    var URL = window.webkitURL || window.URL;

    window.onload = function () {
        var input = document.getElementById('fileInput');
        input.addEventListener('change', handleFiles, false);

        // set original canvas dimensions as max
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
        canvas.setAttribute("dataMaxWidth", canvas.width.toString());
        canvas.setAttribute("dataMaxHeight", canvas.height.toString());
    }

    function grayscale(input, output) {

        //Get the context for the loaded changechangechange
        var inputContext = input.getContext("2d");
        //get the image data;
        var imageData = inputContext.getImageData(0, 0, input.width, input.height);
        //Get the CanvasPixelArray
        var data = imageData.data;

        //Get length of all pixels in image each pixel made up of 4 elements for each pixel, one for Red, Green, Blue and Alpha
        var arraylength = input.width * input.height * 4;
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
            //gray = gray < limit ? 0 : gray;
            //console.log(gray);
            //Set our 3 RGB channels to the computed gray.

            density[gray.toFixed(0)] = density[gray.toFixed(0)] + 1;


            data[i - 3] = gray;
            data[i - 2] = gray;
            data[i - 1] = gray;

        }

        console.log(density, arraylength * arraylength);

        chart(density);

        //get the output context
        var outputContext = output.getContext("2d");

        //Display the output image
        outputContext.putImageData(imageData, 0, 0);
    }

    (<HTMLInputElement>document.getElementById("limit")).addEventListener("input", () => {
        var input = document.getElementById("canvas");
        var output = document.getElementById("canvas2");
        grayscale(input, output);
    })

    function handleFiles(e) {
        var ctx = (<HTMLCanvasElement>document.getElementById('canvas')).getContext('2d');
        var reader = new FileReader();
        var file = e.target.files[0];
        // load to image to get it's width/height
        var img: any = new Image();
        img.onload = function () {
            // setup scaled dimensions
            var scaled = getScaledDim(img, ctx.canvas.getAttribute("dataMaxWidth"), ctx.canvas.getAttribute("dataMaxHeight"));
            // scale canvas to image
            ctx.canvas.width = scaled.width;
            ctx.canvas.height = scaled.height;
            // draw image
            ctx.drawImage(img, 0, 0
                , ctx.canvas.width, ctx.canvas.height
            );

            var input = document.getElementById("canvas");
            var output = document.getElementById("canvas2");
            grayscale(input, output);
        }
        // this is to setup loading the image
        reader.onloadend = function () {
            img.src = reader.result;
        }
        // this is to read the file
        reader.readAsDataURL(file);
    }

    // returns scaled dimensions object
    function getScaledDim(img, maxWidth, maxHeight) {
        var scaled = {
            ratio: img.width / img.height,
            width: img.width,
            height: img.height
        }
        if (scaled.width > maxWidth) {
            scaled.width = maxWidth;
            scaled.height = scaled.width / scaled.ratio;
        }
        if (scaled.height > maxHeight) {
            scaled.height = maxHeight;
            scaled.width = scaled.height / scaled.ratio;
        }
        return scaled;
    }
});