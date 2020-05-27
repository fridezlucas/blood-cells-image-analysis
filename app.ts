/**
 * Algorithmes numériques
 * Mini Projet
 * 
 * @author  : Lucas Fridez
 * @date    : 2020.05.05
 * @version : 2020.05.05
 */

import { Chart } from 'chart.js';
import { Analyser } from './src/Analyser';

/**
 * DOM is loaded, time to run mini project ! :-D
 */
document.addEventListener("DOMContentLoaded", () => {

    let WhiteBloodAnalyser: Analyser = new Analyser({
        idCanvasOriginal: "canvas",
        idCanvasGray: "canvas-gray",
        idCanvasBW: "canvas2",
        idCanvasChart: "myChart",
        idCanvasProcessing: "canvas4",
        idCanvasResult: "canvas5"
    }, "selectImage", "limitMin", "limitMax", "fileInput");
});