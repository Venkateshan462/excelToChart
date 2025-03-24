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
//       .data(root.descendants().slice(1))
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

// // import React, { useEffect, useRef } from "react";
// // import * as d3 from "d3";

// // // Function to add `value` dynamically for leaf nodes
// // const addValueToLeaves = (node) => {
// //   if (!node.children || node.children.length === 0) {
// //     node.value = 1; // Assign a default value
// //   } else {
// //     node.children.forEach(addValueToLeaves);
// //     node.value = node.children.reduce(
// //       (sum, child) => sum + (child.value || 0),
// //       0
// //     );
// //   }
// // };

// // const SunburstChart = (data) => {
// //   const treeData = data.data;
// //   console.log("treeData", treeData);
// //   const svgRef = useRef(null);

// //   useEffect(() => {
// //     if (!treeData || !svgRef.current) return;

// //     // Clone the data to avoid modifying original object
// //     const data = JSON.parse(JSON.stringify(treeData));

// //     // Assign values to nodes dynamically
// //     addValueToLeaves(data);

// //     // Set up SVG dimensions
// //     const width = 1000;
// //     const height = 1000;
// //     const radius = Math.min(width, height) / 2;

// //     // Clear previous chart before rendering new one
// //     d3.select(svgRef.current).selectAll("*").remove();

// //     // Create the root hierarchy and sum values
// //     const root = d3.hierarchy(data).sum((d) => d.value || 0);

// //     // Create partition layout
// //     const partition = d3.partition().size([2 * Math.PI, radius]);

// //     // Compute the partition layout
// //     partition(root);

// //     // Create arc generator
// //     const arc = d3
// //       .arc()
// //       .startAngle((d) => d.x0)
// //       .endAngle((d) => d.x1)
// //       .innerRadius((d) => d.y0)
// //       .outerRadius((d) => d.y1);

// //     // Create SVG container
// //     const svg = d3
// //       .select(svgRef.current)
// //       .attr("width", width)
// //       .attr("height", height)
// //       .append("g")
// //       .attr("transform", `translate(${width / 2},${height / 2})`);

// //     // Draw Sunburst Chart Paths
// //     svg
// //       .selectAll("path")
// //       .data(root.descendants().slice(1)) // Exclude root node
// //       .enter()
// //       .append("path")
// //       .attr("d", arc)
// //       .attr("fill", (d) => d3.interpolateCool(d.depth / 5))
// //       .attr("stroke", "#fff")
// //       .on("mouseover", function () {
// //         d3.select(this).attr("fill", "#ff6347");
// //       })
// //       .on("mouseout", function (event, d) {
// //         d3.select(this).attr("fill", d3.interpolateCool(d.depth / 5));
// //       });

// //     // Add Labels
// //     svg
// //       .selectAll("text")
// //       .data(root.descendants().slice(1)) // Exclude root node
// //       .enter()
// //       .append("text")
// //       .attr("transform", (d) => {
// //         const [x, y] = arc.centroid(d);
// //         return `translate(${x},${y}) rotate(${
// //           ((d.x0 + d.x1) / 2) * (180 / Math.PI) - 90
// //         })`;
// //       })
// //       .attr("text-anchor", "middle")
// //       .attr("font-size", "10px")
// //       .text((d) => d.data.name);
// //     console.log(root.descendants());
// //   }, [treeData]);

// //   return <svg ref={svgRef}></svg>;
// // };

// // export default SunburstChart;

// // import React, { useEffect, useRef } from "react";
// // import * as d3 from "d3";

// // const SunburstChart = (treeData) => {
// //   console.log("treeData==>", treeData);
// //   const svgRef = useRef(null);

// //   useEffect(() => {
// //     if (!treeData || !svgRef.current) return;

// //     const width = 600,
// //       height = 600,
// //       radius = Math.min(width, height) / 2;

// //     // Clear previous render
// //     d3.select(svgRef.current).selectAll("*").remove();

// //     // Create partition layout
// //     const partition = d3.partition().size([2 * Math.PI, radius]);

// //     // Convert data to D3 hierarchy and compute partition layout
// //     const root = d3.hierarchy(treeData).count();
// //     partition(root);

// //     // Define arc generator
// //     const arc = d3
// //       .arc()
// //       .startAngle((d) => d.x0)
// //       .endAngle((d) => d.x1)
// //       .innerRadius((d) => d.y0)
// //       .outerRadius((d) => d.y1);

// //     // Create SVG container
// //     const svg = d3
// //       .select(svgRef.current)
// //       .attr("width", width)
// //       .attr("height", height)
// //       .append("g")
// //       .attr("transform", `translate(${width / 2},${height / 2})`);

// //     // Draw sunburst chart paths
// //     svg
// //       .selectAll("path")
// //       .data(root.descendants().slice(1)) // Exclude root node
// //       .enter()
// //       .append("path")
// //       .attr("d", arc)
// //       .attr("fill", (d) => d3.interpolateCool(d.depth / 5))
// //       .attr("stroke", "#fff")
// //       .on("mouseover", (event, d) => {
// //         d3.select(event.currentTarget).attr("fill", "#ff6347");
// //       })
// //       .on("mouseout", (event, d) => {
// //         d3.select(event.currentTarget).attr(
// //           "fill",
// //           d3.interpolateCool(d.depth / 5)
// //         );
// //       });

// //     // Add labels
// //     svg
// //       .selectAll("text")
// //       .data(root.descendants().slice(1)) // Exclude root node
// //       .enter()
// //       .append("text")
// //       .attr("transform", (d) => {
// //         const [x, y] = arc.centroid(d);
// //         return `translate(${x},${y}) rotate(${
// //           ((d.x0 + d.x1) / 2) * (180 / Math.PI) - 90
// //         })`;
// //       })
// //       .attr("text-anchor", "middle")
// //       .attr("font-size", "10px")
// //       .text((d) => d.data.name);
// //   }, [treeData]);

// //   return <svg ref={svgRef}>hi</svg>;
// // };

// // export default SunburstChart;


import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import treeData from "../Pharma_ProcessMap.json"; // Importing JSON file

const filterSecondChild = (data) => {
  if (!data.children) return { ...data, children: [] };
  return {
    ...data,
    children: data.children.flatMap((child) => child.children || []),
  };
};

const TangledTree = () => {
  const ref = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(filterSecondChild(treeData));
  }, []);

  useEffect(() => {
    if (!data) return;
    d3.select(ref.current).selectAll("*").remove();

    const width = 400;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    const tree = d3
      .tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2) / a.depth);
    const root = tree(
      d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))
    );

    const svg = d3
      .select(ref.current)
      .attr("viewBox", [-cx, -cy, width * 1.1, height * 1.1])
      .attr("style", "width: 100%; height: auto; font: 6px sans-serif;");

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

const SunburstChart = () => {
  const ref = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(filterSecondChild(treeData));
  }, []);

  useEffect(() => {
    if (!data) return;
    d3.select(ref.current).selectAll("*").remove();

    const width = 1800;
    const height = 1200;
    const radius = Math.min(width, height) / 2 - 10;

    const root = d3.hierarchy(data).sum((d) => d.value || 1);
    const partition = d3.partition().size([2 * Math.PI, radius]);
    partition(root);

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select(ref.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr(
        "style",
        "width: 100%; max-width: 1000px; height: auto; font: 10px sans-serif; margin: 0 auto;"
      );

    svg
      .append("g")
      .selectAll("path")
      .data(root.descendants())
      .join("path")
      .attr("fill", (d) => color(d.depth))
      .attr("d", arc)
      .attr("stroke", "#fff");

    svg
      .append("g")
      .selectAll("text")
      .data(root.descendants().filter((d) => d.depth))
      .join("text")
      .attr("transform", (d) => {
        const x = ((d.x0 + d.x1) / 2) * (180 / Math.PI);
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`;
      })
      .attr("text-anchor", (d) =>
        (d.x0 + d.x1) / 2 < Math.PI ? "start" : "end"
      )
      .attr("dy", "0.25em")
      .attr("font-size", "16px")
      .text((d) => d.data.name);
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <svg ref={ref}></svg>
    </div>
  );
};

// Exporting properly
export { SunburstChart };
export default TangledTree;

