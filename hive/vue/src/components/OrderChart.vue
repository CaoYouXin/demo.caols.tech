<template>
  <div class="chart" v-d3chart="" @dblclick="toggleTweenOverlapAndStacked()"></div>
</template>

<script>
  import * as d3 from 'd3';
  import Vue from 'vue';
  import tt from '../directives/D3Chart';

  export default {
    name: 'order-chart',
    data: () => ({
      htmlValue: null,
      path: '',
      data: null,
      x0: null,
      x1: null,
      y1: null,
      y2: null,
      y1Axis: null,
      y2Axis: null,
      height: null,
      toggle: false,
      canClick: false
    }),
    methods: {
      createChart(el) {
        let self = this;
        let parseDate = d3.timeParse('%Y-%m');
        let formatDate = d3.timeFormat('%Y-%m');
        d3.csv("static/data/order-chart-data.csv", function (error, data) {
          let columnHeaders = d3.keys(data[0]).filter(function (key) {
            return key !== "Date";
          });
          data.forEach(function (d) {
            let yBegin = 0;
            let yEnd = 0;

            d.Date = formatDate(parseDate(d.Date));

            d.columnDetails = [].map.call(columnHeaders, (name) => {
              let value = +d[name];
              yBegin = yEnd;
              yEnd += value;
              return {name: name, yBegin: yBegin, yEnd: yEnd, value: value};
            });

            d.total = d3.max(d.columnDetails, (d) => {
              return d.yEnd;
            });

            d.vMax = d3.max(d.columnDetails, (d) => {
              return d.value;
            });
          });

          self.data = data;
          self.makeChart(columnHeaders, data);
          el.innerHTML = self.htmlValue;
        });
      },
      makeChart(columnHeaders, data) {
        let margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

        let x0 = d3.scaleBand()
          .domain([].map.call(data, (d) => {
            return d.Date;
          }))
          .rangeRound([0, width])
          .padding(0.1);

        let x1 = d3.scaleBand().domain(columnHeaders).rangeRound([0, x0.bandwidth()]);

        let y1 = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, (d) => {
          return d.total;
        })]);

        let y2 = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, (d) => {
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
          .attr('y', (d) => {
            return y1(d.yBegin);
          })
          .attr('height', 0)
          .attr('opacity', 0)
          .style("fill", (d) => {
            return color(d.name);
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
          .style("fill", (d) => {
            return color(d);
          });

        legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text((d) => {
            return d;
          });

        this.x0 = x0;
        this.x1 = x1;
        this.y1 = y1;
        this.y2 = y2;
        this.y1Axis = y1Axis;
        this.y2Axis = y2Axis;
        this.height = height;

        this.htmlValue = node.innerHTML;
      },
      startTransition(el) {
        const root = d3.select(el);
        const y1 = this.y1;

        let delay = 0;

        this.data.forEach((datum, j) => {
          const rects = root.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect');

          rects.each((_, k, marker) => {
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

          delay = (5 * rects.length - rects.length * rects.length / 2) * 100;
        });

        const self = this;
        setTimeout(() => self.canClick = true, delay);
      },
      toggleTweenOverlapAndStacked() {
        if (!this.canClick) {
          return;
        }

        this.toggle = !this.toggle;

        const x0 = this.x0;
        const x1 = this.x1;
        const y1 = this.y1;
        const y2 = this.y2;
        const y1Axis = this.y1Axis;
        const y2Axis = this.y2Axis;
        const height = this.height;

        if (this.toggle) {
          this.changeYAxis(y2Axis);

          this.data.forEach((datum, j) => {
            d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each((_, k, marker) => {
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

          this.data.forEach((datum, j) => {
            d3.selectAll('svg > g > g.bars > g:nth-child(' + (j + 1) + ') > rect').each((_, k, marker) => {
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
      },
      changeYAxis(yAxisGen) {
        let yAxis = d3.select('svg > g > g.y.axis');
        yAxisGen(yAxis.transition());
        setTimeout(() => tt(yAxis.node()), 3000);
      },
    },
  }
</script>

<style scoped>
  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .x.axis path {
    display: none;
  }

  .y.axis text {
    fill: #344020;
  }
</style>
