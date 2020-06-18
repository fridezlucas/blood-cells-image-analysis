/**
 * Spectrum Chart class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.18
 * @version 2020.06.18
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";
import { Chart } from 'chart.js';
import { Slider } from "../components/Slider";

const verticalLinePlugin = {
    getLinePosition: function (chart, pointIndex) {
        const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
        const data = meta.data;
        return data[pointIndex]._model.x;
    },
    renderVerticalLine: function (chartInstance, pointIndex: PointLineI) {
        const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex.index);
        const scale = chartInstance.scales['y-axis-0'];
        const context = chartInstance.chart.ctx;

        // render vertical line
        context.beginPath();
        context.strokeStyle = '#ff0000';
        context.moveTo(lineLeftOffset, scale.top);
        context.lineTo(lineLeftOffset, scale.bottom);
        context.stroke();

        // write label
        context.fillStyle = "#ff0000";
        context.textAlign = 'center';
        context.fillText(pointIndex.text, lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
    },

    afterDatasetsDraw: function (chart, easing) {
        if (chart.config.lineAtIndex) {
            chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
        }
    }
};

Chart.plugins.register(verticalLinePlugin);

/**
 * SpectrumChart to draw a Chart of black white density pixel from a grayscale image
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class SpectrumChart extends Canvas {

    // Properties
    private arrayDensityPixels: Array<number>;
    private chart: any;

    /**
     * Instanciate a new SpectrumChart
     * @param idCanvasChart id of canvas to draw a spectrum chart
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idCanvasChart: string) {
        super(idCanvasChart);
        this.chart = null;
        this.arrayDensityPixels = new Array<number>();
    }

    /**
     * Find Threshold peak according to black limit option (set by user)
     * 
     * @param data density array of image pixels
     * @param limit black limit for threshold
     * 
     * @return index of peak value [0; 255]
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private findThresholdPeak = (data: Array<number>, limit: number): number => {

        let max: number = 0;
        let index: number = 0;

        for (let i = 0; i < data.length; ++i) {
            if (i < limit && data[i] > max) {
                max = data[i];
                index = i;
            }
        }

        return index;
    }

    /**
     * Find Threshold minimum
     * 
     * @param data density array of image pixels
     * 
     * @return index of minimum value to keep for black value
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private findThresholdMin = (data: Array<number>): number => {
        let minIndex: number = 0;
        let isMinDefined: boolean = false;

        // Find first value greater than 0
        for (let d = 1; d < data.length; d++) {
            if (data[d] > 0 && !isMinDefined) {
                return d;
            }
        }
    }

    /**
     * Find threshold min and max values
     * 
     * @param data density array of image pixels
     * @param limit black limit for threshold
     * 
     * @return min and max values for threshold
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private findThreshold = (data: Array<number>, limit: number): { min: number, max: number } => {
        // Find min and max threshold values
        let minIndex: number = this.findThresholdMin(data);
        let peakIndex: number = this.findThresholdPeak(data, limit);
        let interval: number = peakIndex - minIndex;
        let maxIndex: number = peakIndex + interval > limit ? limit : peakIndex + interval;

        return { min: minIndex, max: maxIndex };
    }

    /**
     * Draw Spectrum Chart
     * 
     * @param data density array of image pixels
     * @param minInput Slider for minInput threshold (user option)
     * @param maxInput Slider for maxInput threshold (user option)
     * @limit black limit for threshold
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawChart = (data: Array<number>, minInput: Slider, maxInput: Slider, limit: number): void => {

        // Find thresholh and adapt sliders
        let threshold: { min: number, max: number } = this.findThreshold(data, limit);
        minInput.setValue(threshold.min);
        maxInput.setValue(threshold.max);

        let xAxis: Array<number> = [...Array(limit + 1).keys()];

        this.updateChart(data, limit, xAxis, threshold);
    }

    /**
     * Update Chart
     * 
     * @param data density array of image pixels
     * @param limit black limit for threshold
     * @param xAxis value for xAxis to draw
     * @param threshold min and max values to draw vertical lines
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private updateChart = (data: number[], limit: number, xAxis: number[], threshold: { min: number; max: number; }): void => {
        while (data.length > limit + 1) {
            data.pop();
        }

        // Destroy previous chart (avoid unexpected behaviour on hover)
        if (this.chart != null) {
            this.chart.destroy();
        }

        // Draw chart with 2 vertical lines (min and max threshold)
        this.chart = new Chart(this.context, {
            type: 'bar',
            data: {
                labels: xAxis,
                datasets: [{
                    label: 'Number of pixel',
                    data: data,
                    borderWidth: 1
                }]
            },
            lineAtIndex: [{ text: "Min", index: threshold.min }, { text: "Max", index: threshold.max }],
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
        } as any);
    }
}