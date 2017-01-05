<template>
  <div class="chart">
    <div v-d3chart="{ htmlValue: htmlValue, styleUrl:styleUrl, cb:startTransitions, cbParams:cbParams }"></div>
  </div>
</template>

<script>
  import * as d3 from 'd3';
  import vue from 'vue';

  export default {
    name: 'user-chart',
    data: () => ({
      htmlValue: null,
      styleUrl: null,
      startTransitions: null,
      cbParams: null,
    }),
    addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
      const legendWidth = 200, legendHeight = 100;

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

      const axes = svg.append('g')
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

      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (chartWidth - legendWidth) + ',0)');

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
    },
    drawPaths(svg, data, x, y) {
      const upperOuterArea = d3.area()
        .curve(d3.curveBasis)
        .x(() => (x(d['date']) || 1
        ))
        .y0(() => (y(d['pct95'])
        ))
        .y1(() => (y(d['pct75'])
        ));

      const upperInnerArea = d3.area()
        .curve(d3.curveBasis)
        .x(() => (x(d['date']) || 1
        ))
        .y0(() => (y(d['pct75'])
        ))
        .y1(() => (y(d['pct50'])
        ));

      const medianLine = d3.line()
        .curve(d3.curveBasis)
        .x(() => (x(d['date'])
        ))
        .y(() => (y(d['pct50'])
        ));

      const lowerInnerArea = d3.area()
        .curve(d3.curveBasis)
        .x(() => (x(d['date']) || 1
        ))
        .y0(() => (y(d['pct50'])
        ))
        .y1(() => (y(d['pct25'])
        ));

      const lowerOuterArea = d3.area()
        .curve(d3.curveBasis)
        .x(() => (x(d['date']) || 1
        ))
        .y0(() => (y(d['pct25'])
        ))
        .y1(() => (y(d['pct05'])
        ));

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
    },
    drawMarkers(svg, chartHeight, markers, x) {
      [].forEach.call(markers, (marker) => {
        const radius = 32,
          xPos = x(marker.date) - radius - 3,
          yPosStart = chartHeight - radius - 3,
          yPosEnd = (marker.type === 'Client' ? 80 : 160) + radius - 3;

        const markerG = svg.append('g')
          .attr('data-rel-x', xPos)
          .attr('data-rel-y', yPosEnd)
          .attr('class', 'marker ' + marker.type.toLowerCase())
          .attr('transform', 'translate(' + xPos + ',' + yPosStart + ')')
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
    },
    startTransitions(chartWidth, chartHeight) {

      const markers = d3.selectAll('svg > g > g.marker');

      markers.each((_, i, marker) => {
        setTimeout(() => {
          const markerG = d3.select(marker[i]);
          const xPos = markerG.attr('data-rel-x');
          const yPosEnd = +markerG.attr('data-rel-y');
          markerG.transition()
            .duration(1000)
            .attr('transform', 'translate(' + xPos + ',' + yPosEnd + ')')
            .attr('opacity', 1);

          const pathG = markerG.select('path');
          const radius = +pathG.attr('data-rel');
          pathG.transition()
            .duration(1000)
            .attr('d', 'M' + radius + ',' + (chartHeight - yPosEnd) + 'L' + radius + ',' + (radius * 2));
        }, 1000 + 500 * i);
      });

      d3.select('#rect-clip > rect').transition()
        .duration(1000 * markers.size())
        .attr('width', chartWidth);
    },
    makeChart(data, markers) {
      const svgWidth = 960,
        svgHeight = 500,
        margin = {top: 20, right: 20, bottom: 40, left: 40},
        chartWidth = svgWidth - margin.left - margin.right,
        chartHeight = svgHeight - margin.top - margin.bottom;

      const x = d3.scaleTime().range([0, chartWidth])
          .domain(d3.extent(data, () => (d['date']
          ))),
        y = d3.scaleLinear().range([chartHeight, 0])
          .domain([0, d3.max(data, () => (d['pct95']
          ))]);

      const xAxis = d3.axisBottom(x).tickSizeInner(-chartHeight).tickSizeOuter(0).tickPadding(10),
        yAxis = d3.axisLeft(y).tickSizeInner(-chartWidth).tickSizeOuter(0).tickPadding(10);

      const node = document.createElement('div');
      const svg = d3.select(node).append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // clipping to start chart hidden and slide it in later
      const rectClip = svg.append('clipPath')
        .attr('id', 'rect-clip')
        .append('rect')
        .attr('width', 0)
        .attr('height', chartHeight);

      this.addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
      this.drawPaths(svg, data, x, y);
      this.drawMarkers(svg, chartHeight, markers, x);

      this.cbParams = [chartWidth, chartHeight];
      this.htmlValue = node.innerHTML;
    },
    created: () => {
      const self = this;
      const parseDate = d3.timeParse('%Y-%m-%d');
      d3.json('data/user-chart-data.json', function fn(error, rawData) {
        if (error) {
          console.error(error);
          return;
        }

        const data = [].map.call() => ({
            date: parseDate(d.date),
            pct05: d.pct05 / 1000,
            pct25: d.pct25 / 1000,
            pct50: d.pct50 / 1000,
            pct75: d.pct75 / 1000,
            pct95: d.pct95 / 1000,
          };));

        d3.json('data/user-chart-markers.json', () => {
          if (error) {
            console.error(error);
            return;
          }

          const markers = [].map.call() => ({
              date: parseDate(marker.date),
              type: marker.type,
              version: marker.version,
            };));

          self.makeChart(data, markers);

          const compiled = vue.compile(self.htmlValue);

          console.log(compiled);
        });

      });

      console.log('user chart init end');
    },
  }
</script>

<style scoped>
  @import url(//fonts.googleapis.com/css?family=Open+Sans:400,700);

  svg {
    font: 14px 'Open Sans';
  }

  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .axis text {
    fill: #000;
  }

  .axis .tick line {
    stroke: rgba(0, 0, 0, 1);
  }

  .area {
    stroke-width: 1;
  }

  .area.outer,
  .legend .outer {
    fill: rgba(230, 230, 255, 0.8);
    stroke: rgba(216, 216, 255, 0.8);
  }

  .area.inner,
  .legend .inner {
    fill: rgba(127, 127, 255, 0.8);
    stroke: rgba(96, 96, 255, 0.8);
  }

  .median-line,
  .legend .median-line {
    fill: none;
    stroke: #000;
    stroke-width: 3;
  }

  .legend .legend-bg {
    fill: rgba(0, 0, 0, 0.5);
    stroke: rgba(0, 0, 0, 0.5);
  }

  .marker.client .marker-bg,
  .marker.client path {
    fill: rgba(255, 127, 0, 0.8);
    stroke: rgba(255, 127, 0, 0.8);
    stroke-width: 3;
  }

  .marker.server .marker-bg,
  .marker.server path {
    fill: rgba(0, 153, 51, 0.8);
    stroke: rgba(0, 153, 51, 0.8);
    stroke-width: 3;
  }

  .marker path {
    fill: none;
  }

  .legend text,
  .marker text {
    fill: #fff;
    font-weight: bold;
  }

  .marker text {
    text-anchor: middle;
  }
</style>
