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
var d3 = require("d3");
var OrderChartComponent = (function () {
    function OrderChartComponent() {
        this.styleUrl = 'app/order-chart.component.css';
        this.cbParams = [];
        this._self = this;
        this.toggle = false;
    }
    OrderChartComponent.prototype.startTransitions = function (columnHeaders, data, x0, x1, y1, y2, y1Axis, y2Axis, height) {
        data.forEach(function (datum, j) {
            d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each(function (_, k, marker) {
                var d = datum.columnDetails[k];
                var markerG = d3.select(marker[k]);
                var _y = +markerG.attr('y');
                var _height = markerG.attr('height');
                markerG.transition()
                    .duration(500)
                    .delay((5 * k - k * k / 2) * 100)
                    .attr("y", y1(d.yEnd))
                    .attr("height", y1(d.yBegin) - y1(d.yEnd))
                    .attr('opacity', 1);
            });
        });
    };
    OrderChartComponent.prototype.toggleTweenOverlapAndStacked = function (columnHeaders, data, x0, x1, y1, y2, y1Axis, y2Axis, height) {
        this.toggle = !this.toggle;
        if (this.toggle) {
            this.changeYAxis(y2Axis);
            data.forEach(function (datum, j) {
                d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each(function (_, k, marker) {
                    var d = datum.columnDetails[k];
                    d3.select(marker[k]).transition()
                        .duration(500)
                        .delay((5 * k - k * k / 2) * 100)
                        .attr("x", x1(d.name))
                        .attr("y", y2(d.value))
                        .attr("width", x1.bandwidth())
                        .attr("height", height - y2(d.value));
                });
            });
        }
        else {
            this.changeYAxis(y1Axis);
            data.forEach(function (datum, j) {
                d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each(function (_, k, marker) {
                    var d = datum.columnDetails[k];
                    d3.select(marker[k]).transition()
                        .duration(500)
                        .delay((5 * k - k * k / 2) * 100)
                        .attr("x", 0)
                        .attr("y", y1(d.yEnd))
                        .attr("width", x0.bandwidth())
                        .attr("height", y1(d.yBegin) - y1(d.yEnd));
                });
            });
        }
    };
    OrderChartComponent.prototype.changeYAxis = function (yAxisGen) {
        var yAxis = d3.select('svg > g > g.y.axis');
        var ngContentSign = yAxis.html().match(/\s(.*?ngcontent.*?)=/)[1];
        yAxisGen(yAxis.transition());
        yAxis.selectAll('g > *').each(function (_, i, marker) {
            d3.select(marker[i]).attr(ngContentSign, true);
        });
    };
    OrderChartComponent.prototype.ngOnInit = function () {
        var self = this;
        var parseDate = d3.timeParse('%Y-%m');
        var formatDate = d3.timeFormat('%Y-%m');
        d3.csv("data/order-chart-data.csv", function (error, data) {
            var columnHeaders = d3.keys(data[0]).filter(function (key) {
                return key !== "Date";
            });
            data.forEach(function (d) {
                var yBegin = 0;
                var yEnd = 0;
                d.Date = formatDate(parseDate(d.Date));
                d.columnDetails = [].map.call(columnHeaders, function (name) {
                    var value = +d[name];
                    yBegin = yEnd;
                    yEnd += value;
                    return { name: name, yBegin: yBegin, yEnd: yEnd, value: value };
                });
                d.total = d3.max(d.columnDetails, function (d) {
                    return d.yEnd;
                });
                d.vMax = d3.max(d.columnDetails, function (d) {
                    return d.value;
                });
            });
            self.makeChart(columnHeaders, data);
        });
        console.log('order chart init end');
    };
    OrderChartComponent.prototype.makeChart = function (columnHeaders, data) {
        var margin = { top: 20, right: 20, bottom: 30, left: 40 }, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
        var x0 = d3.scaleBand()
            .domain([].map.call(data, function (d) {
            return d.Date;
        }))
            .rangeRound([0, width])
            .padding(0.1);
        var x1 = d3.scaleBand().domain(columnHeaders).rangeRound([0, x0.bandwidth()]);
        var y1 = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, function (d) {
                return d.total;
            })]);
        var y2 = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, function (d) {
                return d.vMax;
            })]);
        var xAxis = d3.axisBottom(x0);
        var y1Axis = d3.axisLeft(y1).ticks(10, d3.format("6.1s"));
        var y2Axis = d3.axisLeft(y2).ticks(10, d3.format("6.1s"));
        var color = d3.scaleOrdinal().domain(columnHeaders).range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);
        var node = document.createElement('div');
        var svg = d3.select(node).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(y1Axis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".7em")
            .style("text-anchor", "end")
            .text("population (k)");
        var dg = svg.append('g')
            .attr('class', 'bars')
            .selectAll(".dg")
            .data(data)
            .enter().append("g")
            .attr("class", "dg")
            .attr("transform", function (d) {
            return "translate(" + x0(d.Date) + ",0)";
        })
            .selectAll("rect")
            .data(function (d) {
            return d.columnDetails;
        })
            .enter().append("rect")
            .attr("width", x0.bandwidth())
            .attr("x", 0)
            .attr('y', function (d) {
            return y1(d.yBegin);
        })
            .attr('height', 0)
            .attr('opacity', 0)
            .style("fill", function (d) {
            return color(d.name);
        });
        var legend = svg.selectAll(".legend")
            .data(columnHeaders.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) {
            return color(d);
        });
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
            return d;
        });
        this.cbParams = [columnHeaders, data, x0, x1, y1, y2, y1Axis, y2Axis, height];
        // let array = node.innerHTML.split('<g split-here="ok"><\/g>');
        // array.splice(1, 0, '<g *d3-chart="htmlValue; styleUrl:styleUrl; cb:startTransitions; cbParams:cbParams; context:context; selector: selector"></g>');
        // console.log(array.join(''));
        // this.htmlValue = array.join('');
        this.htmlValue = node.innerHTML;
    };
    return OrderChartComponent;
}());
OrderChartComponent = __decorate([
    core_1.Component({
        selector: 'order-chart',
        template: '<div class="chart" (dblclick)="toggleTweenOverlapAndStacked.apply(_self, cbParams)"><div *d3-chart="htmlValue; styleUrl:styleUrl; cb:startTransitions; cbParams:cbParams;"></div></div>'
    }),
    __metadata("design:paramtypes", [])
], OrderChartComponent);
exports.OrderChartComponent = OrderChartComponent;
//# sourceMappingURL=order-chart.component.js.map