import {Component, OnInit} from "@angular/core";
import * as d3 from "d3";

@Component({
    selector: 'order-chart',
    template: '<div class="chart" (dblclick)="toggleTweenOverlapAndStacked.apply(_self, cbParams)"><div *d3-chart="htmlValue; styleUrl:styleUrl; cb:startTransitions; cbParams:cbParams;"></div></div>'
})
export class OrderChartComponent implements OnInit {
    htmlValue: string;
    styleUrl: string = 'app/order-chart.component.css';
    cbParams: Array<any> = [];
    _self: OrderChartComponent = this;

    startTransitions(columnHeaders: Array<string>, data: Array<any>, x0: any, x1: any, y1: any, y2: any, y1Axis: any, y2Axis: any, height: number) {
        data.forEach((datum: any, j: number) => {
            d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each((_: any, k: number, marker: any) => {
                let d = datum.columnDetails[k];
                let markerG = d3.select(marker[k]);
                let _y = +markerG.attr('y');
                let _height = markerG.attr('height');
                markerG.transition()
                    .duration(500)
                    .delay((5 * k - k * k / 2) * 100)
                    .attr("y", y1(d.yEnd))
                    .attr("height", y1(d.yBegin) - y1(d.yEnd))
                    .attr('opacity', 1);
            });
        });
    }

    private toggle: boolean = false;
    toggleTweenOverlapAndStacked(columnHeaders: Array<string>, data: Array<any>, x0: any, x1: any, y1: any, y2: any, y1Axis: any, y2Axis: any, height: number) {
        this.toggle = !this.toggle;

        if (this.toggle) {
            this.changeYAxis(y2Axis);

            data.forEach((datum: any, j: number) => {
                d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each((_: any, k: number, marker: any) => {
                    let d = datum.columnDetails[k];
                    d3.select(marker[k]).transition()
                        .duration(500)
                        .delay((5 * k - k * k / 2) * 100)
                        .attr("x", x1(d.name))
                        .attr("y", y2(d.value))
                        .attr("width", x1.bandwidth())
                        .attr("height", height - y2(d.value));
                });
            });
        } else {
            this.changeYAxis(y1Axis);

            data.forEach((datum: any, j: number) => {
                d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each((_: any, k: number, marker: any) => {
                    let d = datum.columnDetails[k];
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
    }

    private changeYAxis(yAxisGen: Function) {
        let yAxis = d3.select('svg > g > g.y.axis');
        let ngContentSign = yAxis.html().match(/\s(.*?ngcontent.*?)=/)[1];
        yAxisGen(yAxis.transition());
        yAxis.selectAll('g > *').each((_: any, i: number, marker: any) => {
            d3.select(marker[i]).attr(ngContentSign, true);
        });
    }

    ngOnInit() {
        let self: OrderChartComponent = this;
        let parseDate = d3.timeParse('%Y-%m');
        let formatDate = d3.timeFormat('%Y-%m');
        d3.csv("data/order-chart-data.csv", function (error, data) {
            let columnHeaders = d3.keys(data[0]).filter(function (key) {
                return key !== "Date";
            });
            data.forEach(function (d) {
                let yBegin = 0;
                let yEnd = 0;

                (<any>d).Date = formatDate(parseDate((<any>d).Date));

                (<any>d).columnDetails = [].map.call(columnHeaders, (name: string) => {
                    let value = +d[name];
                    yBegin = yEnd;
                    yEnd += value;
                    return {name: name, yBegin: yBegin, yEnd: yEnd, value: value};
                });

                (<any>d).total = d3.max((<any>d).columnDetails, (d: any) => {
                    return d.yEnd;
                });

                (<any>d).vMax = d3.max((<any>d).columnDetails, (d: any) => {
                    return d.value;
                });
            });

            self.makeChart(columnHeaders, data);
        });

        console.log('order chart init end');
    }

    makeChart(columnHeaders: any, data: any) {
        let margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        let x0 = d3.scaleBand()
            .domain([].map.call(data, (d: any) => {
                return d.Date;
            }))
            .rangeRound([0, width])
            .padding(0.1);

        let x1 = d3.scaleBand().domain(columnHeaders).rangeRound([0, x0.bandwidth()]);

        let y1 = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, (d: any) => {
            return d.total;
        })]);

        let y2 = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, (d: any) => {
            return d.vMax;
        })]);

        let xAxis = d3.axisBottom(x0);

        let y1Axis = d3.axisLeft(y1).ticks(10, d3.format("6.1s"));
        let y2Axis = d3.axisLeft(y2).ticks(10, d3.format("6.1s"));

        let color = d3.scaleOrdinal().domain(columnHeaders).range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

        let node = document.createElement('div');
        let svg = d3.select(node).append("svg")
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

        let dg = svg.append('g')
            .attr('class', 'bars')
            .selectAll(".dg")
            .data(data)
            .enter().append("g")
            .attr("class", "dg")
            .attr("transform", function (d: any) {
                return "translate(" + x0(d.Date) + ",0)";
            })
            .selectAll("rect")
            .data(function (d: any) {
                return d.columnDetails;
            })
            .enter().append("rect")
            .attr("width", x0.bandwidth())
            .attr("x", 0)
            .attr('y', (d: any) => {
                return y1(d.yBegin);
            })
            .attr('height', 0)
            .attr('opacity', 0)
            .style("fill", (d: any) => {
                return <string>color(d.name);
            });

        let legend = svg.selectAll(".legend")
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
            .style("fill", (d: any) => {
                return <string>color(d);
            });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text((d) => {
                return <string>d;
            });

        this.cbParams = [columnHeaders, data, x0, x1, y1, y2, y1Axis, y2Axis, height];
        // let array = node.innerHTML.split('<g split-here="ok"><\/g>');
        // array.splice(1, 0, '<g *d3-chart="htmlValue; styleUrl:styleUrl; cb:startTransitions; cbParams:cbParams; context:context; selector: selector"></g>');
        // console.log(array.join(''));
        // this.htmlValue = array.join('');
        this.htmlValue = node.innerHTML;
    }
}