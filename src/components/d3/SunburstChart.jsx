import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Function to add `value` dynamically for leaf nodes
const addValueToLeaves = (node) => {
  if (!node.children || node.children.length === 0) {
    node.value = 1; // Assign a default value
  } else {
    node.children.forEach(addValueToLeaves);
    node.value = node.children.reduce(
      (sum, child) => sum + (child.value || 0),
      0
    );
  }
};

const SunburstChart = (data) => {
  const treeData = data.data;
  console.log("treeData", treeData);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!treeData || !svgRef.current) return;

    // Clone the data to avoid modifying original object
    const data = JSON.parse(JSON.stringify(treeData));

    // Assign values to nodes dynamically
    addValueToLeaves(data);

    // Set up SVG dimensions
    const width = 1000;
    const height = 1000;
    const radius = Math.min(width, height) / 2;

    // Clear previous chart before rendering new one
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the root hierarchy and sum values
    const root = d3.hierarchy(data).sum((d) => d.value || 0);

    // Create partition layout
    const partition = d3.partition().size([2 * Math.PI, radius]);

    // Compute the partition layout
    partition(root);

    // Create arc generator
    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Draw Sunburst Chart Paths
    svg
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d3.interpolateCool(d.depth / 5))
      .attr("stroke", "#fff")
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#ff6347");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", d3.interpolateCool(d.depth / 5));
      });

    // Add Labels
    svg
      .selectAll("text")
      .data(root.descendants().slice(1)) // Exclude root node
      .enter()
      .append("text")
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x},${y}) rotate(${
          ((d.x0 + d.x1) / 2) * (180 / Math.PI) - 90
        })`;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => d.data.name);
    console.log(root.descendants());
  }, [treeData]);

  return <svg ref={svgRef}></svg>;
};

export default SunburstChart;

// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// // Function to add `value` dynamically for leaf nodes
// const addValueToLeaves = (node) => {
//   if (!node.children || node.children.length === 0) {
//     node.value = 1; // Assign a default value
//   } else {
//     node.children.forEach(addValueToLeaves);
//     node.value = node.children.reduce(
//       (sum, child) => sum + (child.value || 0),
//       0
//     );
//   }
// };

// const SunburstChart = (data) => {
//   const treeData = data.data;
//   console.log("treeData", treeData);
//   const svgRef = useRef(null);

//   useEffect(() => {
//     if (!treeData || !svgRef.current) return;

//     // Clone the data to avoid modifying original object
//     const data = JSON.parse(JSON.stringify(treeData));

//     // Assign values to nodes dynamically
//     addValueToLeaves(data);

//     // Set up SVG dimensions
//     const width = 1000;
//     const height = 1000;
//     const radius = Math.min(width, height) / 2;

//     // Clear previous chart before rendering new one
//     d3.select(svgRef.current).selectAll("*").remove();

//     // Create the root hierarchy and sum values
//     const root = d3.hierarchy(data).sum((d) => d.value || 0);

//     // Create partition layout
//     const partition = d3.partition().size([2 * Math.PI, radius]);

//     // Compute the partition layout
//     partition(root);

//     // Create arc generator
//     const arc = d3
//       .arc()
//       .startAngle((d) => d.x0)
//       .endAngle((d) => d.x1)
//       .innerRadius((d) => d.y0)
//       .outerRadius((d) => d.y1);

//     // Create SVG container
//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${width / 2},${height / 2})`);

//     // Draw Sunburst Chart Paths
//     svg
//       .selectAll("path")
//       .data(root.descendants().slice(1)) // Exclude root node
//       .enter()
//       .append("path")
//       .attr("d", arc)
//       .attr("fill", (d) => d3.interpolateCool(d.depth / 5))
//       .attr("stroke", "#fff")
//       .on("mouseover", function () {
//         d3.select(this).attr("fill", "#ff6347");
//       })
//       .on("mouseout", function (event, d) {
//         d3.select(this).attr("fill", d3.interpolateCool(d.depth / 5));
//       });

//     // Add Labels
//     svg
//       .selectAll("text")
//       .data(root.descendants().slice(1)) // Exclude root node
//       .enter()
//       .append("text")
//       .attr("transform", (d) => {
//         const [x, y] = arc.centroid(d);
//         return `translate(${x},${y}) rotate(${
//           ((d.x0 + d.x1) / 2) * (180 / Math.PI) - 90
//         })`;
//       })
//       .attr("text-anchor", "middle")
//       .attr("font-size", "10px")
//       .text((d) => d.data.name);
//     console.log(root.descendants());
//   }, [treeData]);

//   return <svg ref={svgRef}></svg>;
// };

// export default SunburstChart;

// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const SunburstChart = (treeData) => {
//   console.log("treeData==>", treeData);
//   const svgRef = useRef(null);

//   useEffect(() => {
//     if (!treeData || !svgRef.current) return;

//     const width = 600,
//       height = 600,
//       radius = Math.min(width, height) / 2;

//     // Clear previous render
//     d3.select(svgRef.current).selectAll("*").remove();

//     // Create partition layout
//     const partition = d3.partition().size([2 * Math.PI, radius]);

//     // Convert data to D3 hierarchy and compute partition layout
//     const root = d3.hierarchy(treeData).count();
//     partition(root);

//     // Define arc generator
//     const arc = d3
//       .arc()
//       .startAngle((d) => d.x0)
//       .endAngle((d) => d.x1)
//       .innerRadius((d) => d.y0)
//       .outerRadius((d) => d.y1);

//     // Create SVG container
//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${width / 2},${height / 2})`);

//     // Draw sunburst chart paths
//     svg
//       .selectAll("path")
//       .data(root.descendants().slice(1)) // Exclude root node
//       .enter()
//       .append("path")
//       .attr("d", arc)
//       .attr("fill", (d) => d3.interpolateCool(d.depth / 5))
//       .attr("stroke", "#fff")
//       .on("mouseover", (event, d) => {
//         d3.select(event.currentTarget).attr("fill", "#ff6347");
//       })
//       .on("mouseout", (event, d) => {
//         d3.select(event.currentTarget).attr(
//           "fill",
//           d3.interpolateCool(d.depth / 5)
//         );
//       });

//     // Add labels
//     svg
//       .selectAll("text")
//       .data(root.descendants().slice(1)) // Exclude root node
//       .enter()
//       .append("text")
//       .attr("transform", (d) => {
//         const [x, y] = arc.centroid(d);
//         return `translate(${x},${y}) rotate(${
//           ((d.x0 + d.x1) / 2) * (180 / Math.PI) - 90
//         })`;
//       })
//       .attr("text-anchor", "middle")
//       .attr("font-size", "10px")
//       .text((d) => d.data.name);
//   }, [treeData]);

//   return <svg ref={svgRef}>hi</svg>;
// };

// export default SunburstChart;
