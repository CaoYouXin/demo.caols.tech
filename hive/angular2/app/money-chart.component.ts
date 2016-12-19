import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import * as d3 from "d3";

@Component({
    encapsulation: ViewEncapsulation.Native,
    selector: 'money-chart',
    template: '<div class="chart" [innerHtml]="htmlValue"></div>',
    styleUrls: ['app/money-chart.component.css']
})
export class MoneyChartComponent implements OnInit {
    private _htmlValue: string;

    get htmlValue(): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(this._htmlValue);
    }

    constructor(private domSanitizer: DomSanitizer) {
    }

    ngOnInit() {
        let self: MoneyChartComponent = this;

        function addAxesAndLegend(svg: any, xAxis: any, yAxis: any, margin: any, chartWidth: any, chartHeight: any) {
            let legendWidth = 200,
                legendHeight = 100;

// clipping to make sure nothing appears behind legend
            svg.append('clipPath')
                .attr('id', 'axes-clip')
                .append('polygon')
                .attr('points', (-margin.left) + ',' + (-margin.top) + ' ' +
                    (chartWidth - legendWidth - 1) + ',' + (-margin.top) + ' ' +
                    (chartWidth - legendWidth - 1) + ',' + legendHeight + ' ' +
                    (chartWidth + margin.right) + ',' + legendHeight + ' ' +
                    (chartWidth + margin.right) + ',' + (chartHeight + margin.bottom) + ' ' +
                    (-margin.left) + ',' + (chartHeight + margin.bottom));

            let axes = svg.append('g')
                .attr('clip-path', 'url(#axes-clip)');

            axes.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + chartHeight + ')')
                .call(xAxis);

            axes.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Population (k)');

            let legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');

            legend.append('rect')
                .attr('class', 'legend-bg')
                .attr('width', legendWidth)
                .attr('height', legendHeight);

            legend.append('rect')
                .attr('class', 'outer')
                .attr('width', 75)
                .attr('height', 20)
                .attr('x', 10)
                .attr('y', 10);

            legend.append('text')
                .attr('x', 115)
                .attr('y', 25)
                .text('5% - 95%');

            legend.append('rect')
                .attr('class', 'inner')
                .attr('width', 75)
                .attr('height', 20)
                .attr('x', 10)
                .attr('y', 40);

            legend.append('text')
                .attr('x', 115)
                .attr('y', 55)
                .text('25% - 75%');

            legend.append('path')
                .attr('class', 'median-line')
                .attr('d', 'M10,80L85,80');

            legend.append('text')
                .attr('x', 115)
                .attr('y', 85)
                .text('Median');
        }

        function drawPaths(svg: any, data: any, x: any, y: any) {
            let upperOuterArea = d3.area()
                .curve(d3.curveBasis)
                .x(function (d) {
                    return x(d['date']) || 1;
                })
                .y0(function (d) {
                    return y(d['pct95']);
                })
                .y1(function (d) {
                    return y(d['pct75']);
                });

            let upperInnerArea = d3.area()
                .curve(d3.curveBasis)
                .x(function (d) {
                    return x(d['date']) || 1;
                })
                .y0(function (d) {
                    return y(d['pct75']);
                })
                .y1(function (d) {
                    return y(d['pct50']);
                });

            let medianLine = d3.line()
                .curve(d3.curveBasis)
                .x(function (d) {
                    return x(d['date']);
                })
                .y(function (d) {
                    return y(d['pct50']);
                });

            let lowerInnerArea = d3.area()
                .curve(d3.curveBasis)
                .x(function (d) {
                    return x(d['date']) || 1;
                })
                .y0(function (d) {
                    return y(d['pct50']);
                })
                .y1(function (d) {
                    return y(d['pct25']);
                });

            let lowerOuterArea = d3.area()
                .curve(d3.curveBasis)
                .x(function (d) {
                    return x(d['date']) || 1;
                })
                .y0(function (d) {
                    return y(d['pct25']);
                })
                .y1(function (d) {
                    return y(d['pct05']);
                });

            svg.datum(data);

            svg.append('path')
                .attr('class', 'area upper outer')
                .attr('d', upperOuterArea)
                .attr('clip-path', 'url(#rect-clip)');

            svg.append('path')
                .attr('class', 'area lower outer')
                .attr('d', lowerOuterArea)
                .attr('clip-path', 'url(#rect-clip)');

            svg.append('path')
                .attr('class', 'area upper inner')
                .attr('d', upperInnerArea)
                .attr('clip-path', 'url(#rect-clip)');

            svg.append('path')
                .attr('class', 'area lower inner')
                .attr('d', lowerInnerArea)
                .attr('clip-path', 'url(#rect-clip)');

            svg.append('path')
                .attr('class', 'median-line')
                .attr('d', medianLine)
                .attr('clip-path', 'url(#rect-clip)');
        }

        function addMarker(marker: any, svg: any, chartHeight: any, x: any) {
            let radius = 32,
                xPos = x(marker.date) - radius - 3,
                yPosStart = chartHeight - radius - 3,
                yPosEnd = (marker.type === 'Client' ? 80 : 160) + radius - 3;

            let markerG = svg.append('g')
                .attr('class', 'marker ' + marker.type.toLowerCase())
                .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
                .attr('opacity', 0);

            markerG.transition()
                .duration(1000)
                .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
                .attr('opacity', 1);

            markerG.append('path')
                .attr('d', 'M' + radius + ',' + (chartHeight - yPosStart) + 'L' + radius + ',' + (chartHeight - yPosStart))
                .transition()
                .duration(1000)
                .attr('d', 'M' + radius + ',' + (chartHeight - yPosEnd) + 'L' + radius + ',' + (radius * 2));

            markerG.append('circle')
                .attr('class', 'marker-bg')
                .attr('cx', radius)
                .attr('cy', radius)
                .attr('r', radius);

            markerG.append('text')
                .attr('x', radius)
                .attr('y', radius * 0.9)
                .text(marker.type);

            markerG.append('text')
                .attr('x', radius)
                .attr('y', radius * 1.5)
                .text(marker.version);
        }

        function startTransitions(svg: any, chartWidth: any, chartHeight: any, rectClip: any, markers: any, x: any) {
            rectClip.transition()
                .duration(1000 * markers.length)
                .attr('width', chartWidth);

            markers.forEach(function (marker: any, i: number) {
                setTimeout(function () {
                    addMarker(marker, svg, chartHeight, x);
                }, 1000 + 500 * i);
            });
        }

        function makeChart(data: any, markers: any) {
            let svgWidth = 960,
                svgHeight = 500,
                margin = {top: 20, right: 20, bottom: 40, left: 40},
                chartWidth = svgWidth - margin.left - margin.right,
                chartHeight = svgHeight - margin.top - margin.bottom;

            let x = d3.scaleTime().range([0, chartWidth])
                    .domain(d3.extent(data, function (d) {
                        return d['date'];
                    })),
                y = d3.scaleLinear().range([chartHeight, 0])
                    .domain([0, d3.max(data, function (d) {
                        return d['pct95'];
                    })]);

            let xAxis = d3.axisBottom(x).tickSizeInner(-chartHeight).tickSizeOuter(0).tickPadding(10),
                yAxis = d3.axisLeft(y).tickSizeInner(-chartWidth).tickSizeOuter(0).tickPadding(10);

            let node = document.createElement('div');
            let svg = d3.select(node).append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // clipping to start chart hidden and slide it in later
            let rectClip = svg.append('clipPath')
                .attr('id', 'rect-clip')
                .append('rect')
                .attr('width', 0)
                .attr('height', chartHeight);

            addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
            drawPaths(svg, data, x, y);

            self._htmlValue = node.innerHTML;

            startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x);
        }

        let parseDate = d3.timeParse('%Y-%m-%d');
        d3.json('data/user-chart-data.json', function (error, rawData) {
            if (error) {
                console.error(error);
                return;
            }

            let data = [].map.call(rawData, function (d: any) {
                return {
                    date: parseDate(d['date']),
                    pct05: d.pct05 / 1000,
                    pct25: d.pct25 / 1000,
                    pct50: d.pct50 / 1000,
                    pct75: d.pct75 / 1000,
                    pct95: d.pct95 / 1000
                };
            });

            d3.json('data/user-chart-markers.json', function (error, markerData) {
                if (error) {
                    console.error(error);
                    return;
                }

                let markers = [].map.call(markerData, function (marker: any) {
                    return {
                        date: parseDate(marker.date),
                        type: marker.type,
                        version: marker.version
                    };
                });

                makeChart(data, markers);
            });

        });

        console.log(d3);
    }
}
