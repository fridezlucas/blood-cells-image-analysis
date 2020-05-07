/**
 * Spectrum Chart class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";
import { Chart } from 'chart.js';

/**
 * SpectrumChart to draw a Chart of black white density pixel from a grayscale image
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class SpectrumChart extends Canvas {

    // Properties
    private arrayDensityPixels: Array<number>;
    private static readonly LABELS_X_AXES: Array<number> = [...Array(256).keys()];

    /**
     * Instanciate a new SpectrumChart
     * @param idCanvasChart id of canvas to draw a spectrum chart
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
        this.arrayDensityPixels = new Array<number>();
    }

    /**
     * Draw Spectrum Chart
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawChart = (data: Array<number>): void => {
        var myChart = new Chart(this.context, {
            type: 'bar',
            data: {
                labels: SpectrumChart.LABELS_X_AXES,
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
}