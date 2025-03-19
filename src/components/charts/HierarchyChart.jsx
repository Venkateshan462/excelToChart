// import React, { useEffect, useState } from "react";
// import * as d3 from "d3";
// import * as XLSX from "xlsx";

// const HierarchyChart = ({ file }) => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     if (!file) return;

//     // Read Excel file
//     const readExcel = async () => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const workbook = XLSX.read(event.target.result, { type: "binary" });
//         const sheets = workbook.SheetNames;

//         // Convert sheets into hierarchy data
//         const rootNode = {
//           name: "Root Node",
//           children: sheets.map((sheet) => ({ name: sheet })),
//         };
//         setData(rootNode);
//       };
//       reader.readAsBinaryString(file);
//     };

//     readExcel();
//   }, [file]);

//   useEffect(() => {
//     if (!data) return;

//     const width = 800,
//       height = 600;
//     const svg = d3.select("#chart").attr("width", width).attr("height", height);
//     const g = svg
//       .append("g")
//       .attr("transform", `translate(${width / 2},${height / 2})`);

//     // D3 tree layout
//     const treeLayout = d3.tree().size([360, 200]);
//     const root = d3.hierarchy(data);
//     treeLayout(root);

//     const links = g
//       .selectAll(".link")
//       .data(root.descendants().slice(1))
//       .enter()
//       .append("line")
//       .attr("stroke", "black")
//       .attr("x1", (d) => d.parent.x)
//       .attr("y1", (d) => d.parent.y)
//       .attr("x2", (d) => d.x)
//       .attr("y2", (d) => d.y);

//     const nodes = g
//       .selectAll(".node")
//       .data(root.descendants())
//       .enter()
//       .append("circle")
//       .attr("r", 10)
//       .attr("fill", "blue")
//       .attr("cx", (d) => d.x)
//       .attr("cy", (d) => d.y);
//   }, [data]);

//   return (
//     <div>
//       <input
//         type="file"
//         accept=".xlsx"
//         onChange={(e) => setData(e.target.files[0])}
//       />
//       <svg id="chart"></svg>
//     </div>
//   );
// };

// export default HierarchyChart;


import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const HierarchyChart = ({ data }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!data) return;

    const width = 800, height = 600;
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
    const treeLayout = d3.tree().size([360, 200]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("stroke", "black")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "blue")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default HierarchyChart;
