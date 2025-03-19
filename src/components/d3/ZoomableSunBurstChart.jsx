import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ZoomableSunBurstChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const width = 900;
    const radius = width / 2.5; // Adjust radius for better visibility

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("viewBox", [-width / 2, -width / 2, width, width])
      .style("font", "12px sans-serif");

    const partition = (data) => {
      const root = d3
        .hierarchy(data)
        .sum((d) => (d.children ? 0 : 1))
        .sort((a, b) => b.value - a.value);

      return d3.partition().size([2 * Math.PI, root.height + 1])(root);
    };

    const root = partition(data);
    root.each((d) => (d.current = d));

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, root.descendants().length));

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius / 3)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => d.y1 * radius - 1);

    const path = svg
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("fill", (d) =>
        color(d.ancestors().map((d) => d.data.name).join("/"))
      )
      .attr("d", (d) => arc(d.current))
      .style("cursor", "pointer")
      .on("click", (event, p) => clicked(p));

    function clicked(p) {
      root.each((d) => {
        d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.y0),
          y1: Math.max(0, d.y1 - p.y0),
        };
      });

      const t = svg.transition().duration(750);
      path.transition(t).attrTween("d", (d) => () => arc(d.target));
    }
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default ZoomableSunBurstChart;
