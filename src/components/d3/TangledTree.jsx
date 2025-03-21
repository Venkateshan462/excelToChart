// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const TangledTree = ({ data }) => {
//   const ref = useRef();

//   useEffect(() => {
//     if (!data) return;

//     // Clear previous render
//     d3.select(ref.current).selectAll("*").remove();

//     // Chart dimensions (Reduced size)
//     const width = 700;
//     const height = 700;
//     const cx = width / 2;
//     const cy = height / 2;
//     const radius = Math.min(width, height) / 2 - 80; // Smaller radius

//     // Create radial tree layout
//     const tree = d3
//       .tree()
//       .size([2 * Math.PI, radius])
//       .separation((a, b) => (a.parent === b.parent ? 1.2 : 2) / a.depth); // Increased separation

//     // Sort and apply tree layout
//     const root = tree(
//       d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))
//     );

//     // Create SVG container
//     const svg = d3
//       .select(ref.current)
//       .attr("viewBox", [-cx, -cy, width * 1.1, height * 1.1]) // Scaled viewBox
//       .attr("style", "width: 100%; height: auto; font: 6px sans-serif;"); // Smaller font

//     // Append links
//     svg
//       .append("g")
//       .attr("fill", "none")
//       .attr("stroke", "#555")
//       .attr("stroke-opacity", 0.5)
//       .attr("stroke-width", 1)
//       .selectAll("path")
//       .data(root.links())
//       .join("path")
//       .attr(
//         "d",
//         d3
//           .linkRadial()
//           .angle((d) => d.x)
//           .radius((d) => d.y)
//       );

//     // Append nodes
//     svg
//       .append("g")
//       .selectAll("circle")
//       .data(root.descendants())
//       .join("circle")
//       .attr(
//         "transform",
//         (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
//       )
//       .attr("fill", (d) => (d.children ? "#555" : "#999"))
//       .attr("r", 1.8); // Smaller nodes

//     // Append labels
//     svg
//       .append("g")
//       .attr("stroke-linejoin", "round")
//       .attr("stroke-width", 1.5) // Reduced stroke width
//       .selectAll("text")
//       .data(root.descendants())
//       .join("text")
//       .attr(
//         "transform",
//         (d) =>
//           `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0) rotate(${
//             d.x >= Math.PI ? 180 : 0
//           })`
//       )
//       .attr("dy", "0.2em")
//       .attr("x", (d) => (d.x < Math.PI === !d.children ? 4 : -4)) // Adjusted text offset
//       .attr("text-anchor", (d) =>
//         d.x < Math.PI === !d.children ? "start" : "end"
//       )
//       .attr("paint-order", "stroke")
//       .attr("stroke", "white")
//       .attr("fill", "currentColor")
//       .attr("font-size", "5px") // Smaller font
//       .text((d) => d.data.name);
//   }, [data]);

//   return <svg ref={ref}></svg>;
// };

// export default TangledTree;

// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const TangledTree = ({ data }) => {
//   const ref = useRef();

//   useEffect(() => {
//     if (!data) return;

//     const width = 1200;
//     const height = 1000;
//     const radius = width / 2;

//     console.log("treeData==>", data);

//     const treeLayout = d3.tree().size([2 * Math.PI, radius - 150]);
//     const root = d3.hierarchy(data);
//     treeLayout(root);

//     d3.select(ref.current).selectAll("*").remove(); // Clear previous render

//     const svg = d3
//       .select(ref.current)
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${width / 2},${height / 2})`);

//     const link = svg
//       .selectAll(".link")
//       .data(root.links())
//       .enter()
//       .append("path")
//       .attr("class", "link")
//       .attr("fill", "none")
//       .attr("stroke", "#ccc")
//       .attr("stroke-width", 2)
//       .attr(
//         "d",
//         d3
//           .linkRadial()
//           .angle((d) => d.x)
//           .radius((d) => d.y)
//       );

//     const node = svg
//       .selectAll(".node")
//       .data(root.descendants())
//       .enter()
//       .append("g")
//       .attr("class", "node")
//       .attr(
//         "transform",
//         (d) => `rotate(${(d.x * 180) / Math.PI}) translate(${d.y},0)`
//       );

//     node.append("circle").attr("r", 5).attr("fill", "steelblue");

//     node
//       .append("text")
//       .attr("dy", "0.31em")
//       .attr("x", (d) => (d.x < Math.PI ? 8 : -8))
//       .attr("text-anchor", (d) => (d.x < Math.PI ? "start" : "end"))
//       .attr("transform", (d) => (d.x >= Math.PI ? "rotate(180)" : ""))
//       .text((d) => d.data.name)
//       .style("font-size", "12px")
//       .attr("fill", "#333");
//   }, [data]);

//   return <svg ref={ref}></svg>;
// };

// export default TangledTree;

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import treeData from "../singlesheetPharma.json"; // Importing JSON file directly

const TangledTree = () => {
  const ref = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load JSON data on initial render
    setData(treeData);
  }, []);

  useEffect(() => {
    if (!data) return;

    // Clear previous render
    d3.select(ref.current).selectAll("*").remove();

    // Chart dimensions
    const width = 400;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    // Create radial tree layout
    const tree = d3
      .tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2) / a.depth);

    // Apply tree layout
    const root = tree(
      d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))
    );

    // Create SVG container
    const svg = d3
      .select(ref.current)
      .attr("viewBox", [-cx, -cy, width * 1.1, height * 1.1])
      .attr("style", "width: 100%; height: auto; font: 6px sans-serif;");

    // Append links
    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkRadial()
          .angle((d) => d.x)
          .radius((d) => d.y)
      );

    // Append nodes
    svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr(
        "transform",
        (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      )
      .attr("fill", (d) => (d.children ? "#555" : "#999"))
      .attr("r", 1.8);

    // Append labels
    svg
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 1.5)
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr(
        "transform",
        (d) =>
          `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0) rotate(${
            d.x >= Math.PI ? 180 : 0
          })`
      )
      .attr("dy", "0.2em")
      .attr("x", (d) => (d.x < Math.PI === !d.children ? 4 : -4))
      .attr("text-anchor", (d) =>
        d.x < Math.PI === !d.children ? "start" : "end"
      )
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("fill", "currentColor")
      .attr("font-size", "3px")
      .text((d) => d.data.name);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default TangledTree;
