/**
 * Algorithmes numériques
 * Mini Projet
 * 
 * @author  : Lucas Fridez
 * @date    : 2020.05.05
 * @version : 2020.05.05
 */

/**
 * DOM is loaded, time to run mini project ! :-D
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("OK2");


    var URL = window.webkitURL || window.URL;

    window.onload = function () {
        var input = document.getElementById('fileInput');
        input.addEventListener('change', handleFiles, false);

        // set original canvas dimensions as max
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
        canvas.setAttribute("dataMaxWidth", canvas.width.toString());
        canvas.setAttribute("dataMaxHeight", canvas.height.toString());
    }

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