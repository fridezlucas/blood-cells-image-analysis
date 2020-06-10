/**
 * Spectrum Chart class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

// Imports
import { Canvas } from "./Canvas";
import { Chart } from 'chart.js';

interface Point {
    index: number;
    text: string;
}

const verticalLinePlugin = {
    getLinePosition: function (chart, pointIndex) {
        const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
        const data = meta.data;
        return data[pointIndex]._model.x;
    },
    renderVerticalLine: function (chartInstance, pointIndex: Point) {
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
     * Draw Spectrum Chart
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public drawChart = (data: Array<number>, min: number, max: number, limit: number): void => {
        let xAxis: Array<number> = [...Array(limit + 1).keys()];

        data = data
        while(data.length > limit) {
            data.pop();
        }

        if(this.chart != null) {
            this.chart.destroy();
        }

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
            lineAtIndex: [{ text: "Min", index: min }, { text: "Max", index: max }],
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