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
var platform_browser_1 = require("@angular/platform-browser");
var d3 = require("d3");
var UserChartComponent = (function () {
    function UserChartComponent(domSanitizer) {
        this.domSanitizer = domSanitizer;
    }
    Object.defineProperty(UserChartComponent.prototype, "htmlValue", {
        get: function () {
            return this.domSanitizer.bypassSecurityTrustHtml(this._htmlValue);
        },
        enumerable: true,
        configurable: true
    });
    UserChartComponent.prototype.ngOnInit = function () {
        var self = this;
        function addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
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
        }
        function drawPaths(svg, data, x, y) {
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
        function addMarker(marker, svg, chartHeight, x) {
            var radius = 32, xPos = x(marker.date) - radius - 3, yPosStart = chartHeight - radius - 3, yPosEnd = (marker.type === 'Client' ? 80 : 160) + radius - 3;
            var markerG = svg.append('g')
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
        function startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x) {
            rectClip.transition()
                .duration(1000 * markers.length)
                .attr('width', chartWidth);
            markers.forEach(function (marker, i) {
                setTimeout(function () {
                    addMarker(marker, svg, chartHeight, x);
                }, 1000 + 500 * i);
            });
        }
        function makeChart(data, markers) {
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
            addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
            drawPaths(svg, data, x, y);
            self._htmlValue = node.innerHTML;
            startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x);
        }
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
                makeChart(data, markers);
            });
        });
        console.log(d3);
    };
    return UserChartComponent;
}());
UserChartComponent = __decorate([
    core_1.Component({
        encapsulation: core_1.ViewEncapsulation.Native,
        selector: 'user-chart',
        template: '<div class="chart" [innerHtml]="htmlValue"></div>',
        styleUrls: ['app/user-chart.component.css']
    }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
], UserChartComponent);
exports.UserChartComponent = UserChartComponent;
//# sourceMappingURL=user-chart.component.js.map