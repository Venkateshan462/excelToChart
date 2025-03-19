import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CirclePackingChart = (treeData) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!treeData) return;
    d3.select(svgRef.current).selectAll("*").remove(); // Clear previous chart

    const width = 600,
      height = 600;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const root = d3
      .hierarchy(treeData)
      .sum((d) => (d.children ? 0 : 1))
      .sort((a, b) => b.value - a.value);

    const pack = d3.pack().size([width, height]).padding(5);
    pack(root);

    const nodes = svg
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x - width / 2)
      .attr("cy", (d) => d.y - height / 2)
      .attr("r", (d) => d.r)
      .attr("fill", (d) =>
        d.depth === 0 ? "#ddd" : d3.interpolateCool(d.depth / 5)
      )
      .attr("stroke", "#fff")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("fill", "#ff6347");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr(
          "fill",
          d3.interpolateCool(d.depth / 5)
        );
      });

    svg
      .selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x - width / 2)
      .attr("y", (d) => d.y - height / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => (d.children ? "" : d.data.name));
  }, [treeData]);

  return <svg ref={svgRef}></svg>;
};

export default CirclePackingChart;
