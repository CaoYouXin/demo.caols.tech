"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var d3 = require("d3");
var MoneyChartComponent = (function () {
    function MoneyChartComponent(location) {
        this.location = location;
        this.styleUrl = 'app/money-chart.component.css';
        this.path = this.location.path(false);
    }
    MoneyChartComponent.prototype.addAxesAndLegend = function (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
        var legendWidth = 200, legendHeight = 100;
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
        var axes = svg.append('g')
            .attr('clip-path', 'url(' + this.path + '#axes-clip)');
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
        var legend = svg.append('g')
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
    };
    MoneyChartComponent.prototype.drawPaths = function (svg, data, x, y) {
        var upperOuterArea = d3.area()
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
        var upperInnerArea = d3.area()
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
        var medianLine = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
            return x(d['date']);
        })
            .y(function (d) {
            return y(d['pct50']);
        });
        var lowerInnerArea = d3.area()
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
        var lowerOuterArea = d3.area()
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
            .attr('clip-path', 'url(' + this.path + '#rect-clip)');
        svg.append('path')
            .attr('class', 'area lower outer')
            .attr('d', lowerOuterArea)
            .attr('clip-path', 'url(' + this.path + '#rect-clip)');
        svg.append('path')
            .attr('class', 'area upper inner')
            .attr('d', upperInnerArea)
            .attr('clip-path', 'url(' + this.path + '#rect-clip)');
        svg.append('path')
            .attr('class', 'area lower inner')
            .attr('d', lowerInnerArea)
            .attr('clip-path', 'url(' + this.path + '#rect-clip)');
        svg.append('path')
            .attr('class', 'median-line')
            .attr('d', medianLine)
            .attr('clip-path', 'url(' + this.path + '#rect-clip)');
    };
    MoneyChartComponent.prototype.drawMarkers = function (svg, chartHeight, markers, x) {
        [].forEach.call(markers, function (marker) {
            var radius = 32, xPos = x(marker.date) - radius - 3, yPosStart = chartHeight - radius - 3, yPosEnd = (marker.type === 'Client' ? 80 : 160) + radius - 3;
            var markerG = svg.append('g')
                .attr('data-rel-x', xPos)
                .attr('data-rel-y', yPosEnd)
                .attr('class', 'marker ' + marker.type.toLowerCase())
                .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
                .attr('opacity', 0);
            markerG.append('path')
                .attr('data-rel', radius)
                .attr('d', 'M' + radius + ',' + (chartHeight - yPosStart) + 'L' + radius + ',' + (chartHeight - yPosStart));
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
        });
    };
    MoneyChartComponent.prototype.startTransitions = function (chartWidth, chartHeight) {
        var markers = d3.selectAll('svg > g > g.marker');
        markers.each(function (_, i, marker) {
            setTimeout(function () {
                var markerG = d3.select(marker[i]);
                var xPos = markerG.attr('data-rel-x');
                var yPosEnd = +markerG.attr('data-rel-y');
                markerG.transition()
                    .duration(1000)
                    .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
                    .attr('opacity', 1);
                var pathG = markerG.select('path');
                var radius = +pathG.attr('data-rel');
                pathG.transition()
                    .duration(1000)
                    .attr('d', 'M' + radius + ',' + (chartHeight - yPosEnd) + 'L' + radius + ',' + (radius * 2));
            }, 1000 + 500 * i);
        });
        d3.select('#rect-clip > rect').transition()
            .duration(1000 * markers.size())
            .attr('width', chartWidth);
    };
    MoneyChartComponent.prototype.makeChart = function (data, markers) {
        var svgWidth = 960, svgHeight = 500, margin = { top: 20, right: 20, bottom: 40, left: 40 }, chartWidth = svgWidth - margin.left - margin.right, chartHeight = svgHeight - margin.top - margin.bottom;
        var x = d3.scaleTime().range([0, chartWidth])
            .domain(d3.extent(data, function (d) {
            return d['date'];
        })), y = d3.scaleLinear().range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) {
                return d['pct95'];
            })]);
        var xAxis = d3.axisBottom(x).tickSizeInner(-chartHeight).tickSizeOuter(0).tickPadding(10), yAxis = d3.axisLeft(y).tickSizeInner(-chartWidth).tickSizeOuter(0).tickPadding(10);
        var node = document.createElement('div');
        var svg = d3.select(node).append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        // clipping to start chart hidden and slide it in later
        var rectClip = svg.append('clipPath')
            .attr('id', 'rect-clip')
            .append('rect')
            .attr('width', 0)
            .attr('height', chartHeight);
        this.addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
        this.drawPaths(svg, data, x, y);
        this.drawMarkers(svg, chartHeight, markers, x);
        this.cbParams = [chartWidth, chartHeight];
        this.htmlValue = node.innerHTML;
    };
    MoneyChartComponent.prototype.ngOnInit = function () {
        var self = this;
        var parseDate = d3.timeParse('%Y-%m-%d');
        d3.json('data/user-chart-data.json', function (error, rawData) {
            if (error) {
                console.error(error);
                return;
            }
            var data = [].map.call(rawData, function (d) {
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
                var markers = [].map.call(markerData, function (marker) {
                    return {
                        date: parseDate(marker.date),
                        type: marker.type,
                        version: marker.version
                    };
                });
                self.makeChart(data, markers);
            });
        });
        console.log('money chart init end');
    };
    return MoneyChartComponent;
}());
MoneyChartComponent = __decorate([
    core_1.Component({
        selector: 'money-chart',
        template: '<div class="chart"><div *d3-chart="htmlValue; styleUrl:styleUrl; cb:startTransitions; cbParams:cbParams"></div></div>',
        styles: ["\n        .chart {\n            background-color: #34352C;\n        }\n    "],
    }),
    __metadata("design:paramtypes", [common_1.Location])
], MoneyChartComponent);
exports.MoneyChartComponent = MoneyChartComponent;
//# sourceMappingURL=money-chart.component.js.map