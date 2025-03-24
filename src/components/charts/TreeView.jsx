// import React, { useState, useEffect, useRef } from "react";
// import Tree from "react-d3-tree";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const TreeView = ({ data }) => {
//   const [treeData, setTreeData] = useState([]);
//   const treeContainerRef = useRef(null);

//   useEffect(() => {
//     if (data) {
//       setTreeData([data]);
//     }
//   }, [data]);

//   const exportToPDF = () => {
//     if (!treeContainerRef.current) return;

//     html2canvas(treeContainerRef.current, { useCORS: true }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("landscape", "mm", "a2");
//       const imgWidth = 290; // Adjust width for A4
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
//       pdf.save("tree-structure.pdf");
//     });
//   };

//   const renderCustomNode = ({ nodeDatum, toggleNode }) => {
//     const maxCharsPerLine = 12;
//     const maxLines = 2;
//     const words = nodeDatum.name.split(" ");
//     const lines = [];
//     let currentLine = "";

//     words.forEach((word) => {
//       if ((currentLine + word).length <= maxCharsPerLine) {
//         currentLine += (currentLine ? " " : "") + word;
//       } else {
//         lines.push(currentLine);
//         currentLine = word;
//       }
//     });
//     if (currentLine) lines.push(currentLine);

//     if (lines.length > maxLines) {
//       lines.splice(maxLines);
//       lines[maxLines - 1] += "...";
//     }

//     const textHeight = 18;
//     const boxPadding = 5;
//     const boxWidth = 150;
//     const boxHeight = lines.length * textHeight + boxPadding * 2;

//     return (
//       <g>
//         <circle
//           r={10}
//           fill="steelblue"
//           onClick={toggleNode}
//           style={{ cursor: "pointer" }}
//         />

//         <rect
//           x={-boxWidth / 2}
//           y={15}
//           width={boxWidth}
//           height={boxHeight}
//           fill="white"
//           stroke="black"
//           rx={5}
//           ry={5}
//         />

//         {lines.map((line, i) => (
//           <text
//             key={i}
//             x={0}
//             y={30 + i}
//             textAnchor="middle"
//             style={{
//               fontFamily: "sans-serif",
//               fontSize: "10px",
//               fontWeight: "normal",
//               letterSpacing: "1.5px",
//               lineHeight: "1.2em",
//             }}
//           >
//             <tspan x="0" dy={i === 0 ? "0" : "1.2em"}>
//               {line}
//             </tspan>
//           </text>
//         ))}
//       </g>
//     );
//   };

//   return (
//     <div>
//       <button
//         onClick={exportToPDF}
//         style={{
//           marginBottom: "10px",
//           padding: "8px 16px",
//           background: "#007bff",
//           color: "#fff",
//           border: "none",
//           cursor: "pointer",
//           borderRadius: "5px",
//         }}
//       >
//         Export as PDF
//       </button>
//       <div ref={treeContainerRef} style={{ width: "100%", height: "100vh" }}>
//         {treeData.length > 0 && (
//           <Tree
//             data={treeData}
//             orientation="horizontal"
//             translate={{ x: 500, y: 300 }}
//             zoomable={true}
//             collapsible={true}
//             initialDepth={2}
//             nodeSize={{ x: 250, y: 120 }}
//             pathFunc="step"
//             renderCustomNodeElement={renderCustomNode}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TreeView;

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import treeData from "../Pharma_ProcessMap.json";

/** Utility function to filter data based on selected category */
const filterBySelectedCategory = (data, selectedCategory) => {
  if (!selectedCategory || selectedCategory === "All") return data;
  const selectedNode = data.children?.find(
    (child) => child.name === selectedCategory
  );
  return selectedNode
    ? { ...data, children: [selectedNode] }
    : { ...data, children: [] };
};

/** Tangled Tree Component */
const TangledTree = ({ filteredData }) => {
  const ref = useRef();

  useEffect(() => {
    if (!filteredData) return;
    d3.select(ref.current).selectAll("*").remove();

    const width = 800,
      height = 800,
      radius = Math.min(width, height) / 2 - 120;
    const tree = d3
      .tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2) / a.depth);
    const root = tree(
      d3
        .hierarchy(filteredData)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name))
    );

    const svg = d3
      .select(ref.current)
      .attr("viewBox", [-620,-750,1300,1300])
      .attr("style", "width: 100%; height: auto; font: 8px sans-serif;");

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

    const node = svg
      .append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr(
        "transform",
        (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      );

    node
      .append("circle")
      .attr("fill", (d) => (d.children ? "#555" : "#999"))
      .attr("r", 3);

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.x < Math.PI ? 6 : -6))
      .attr("text-anchor", (d) => (d.x < Math.PI ? "start" : "end"))
      .attr("transform", (d) => (d.x >= Math.PI ? "rotate(180)" : null))
      .text((d) => d.data.name)
      .style("font-size", "10px")
      .style("fill", "#333");
  }, [filteredData]);

  return <svg ref={ref}></svg>;
};

/** Sunburst Chart Component */
const SunburstChart = ({ filteredData }) => {
  const ref = useRef();

  useEffect(() => {
    if (!filteredData) return;
    d3.select(ref.current).selectAll("*").remove();

    const width = 900,
      height = 900,
      radius = Math.min(width, height) / 2 - 100;
    const root = d3.hierarchy(filteredData).sum((d) => d.value || 1);
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
      .attr("viewBox", [-650,-620,1200,1200])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

    const slice = svg
      .append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g");

    slice
      .append("path")
      .attr("fill", (d) => color(d.depth))
      .attr("d", arc)
      .attr("stroke", "#fff");

    slice
      .append("text")
      .attr("transform", (d) => {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        return `translate(${arc.centroid(d)}) rotate(${
          x < 180 ? x - 90 : x + 90
        })`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => (d.depth > 0 ? d.data.name : ""))
      .style("font-size", "10px")
      .style("fill", "#000");
  }, [filteredData]);

  return <svg ref={ref}></svg>;
};

/** Main TreeView Component */
const TreeView = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const exportRef = useRef();

  useEffect(() => {
    setData(treeData);
    setFilteredData(treeData);
  }, []);

  useEffect(() => {
    if (data) {
      setFilteredData(filterBySelectedCategory(data, selectedCategory));
    }
  }, [selectedCategory, data]);

  /** Function to export visualization to PDF */
  const exportToPDF = async () => {
    const input = exportRef.current;
    if (!input) return;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("tree_visualization.pdf");
    });
  };

  return (
    <div>
      <div style={{ float: "left", width: "80%" }}>
        <h2>Tree Visualization</h2>
        <div>
          <label htmlFor="category">Filter by: </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Research">Research</option>
            <option value="Development">Development</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>
      {/* <div style={{ float: "right", width: "20%" }}>
        <button
          onClick={exportToPDF}
          style={{
            marginTop: "20px",
            padding: "10px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
            float: "right",
          }}
        >
          Export as PDF
        </button>
      </div> */}

      {/* Export Container */}
      <div
        ref={exportRef}
        style={{ padding: "20px", background: "#fff", width:"100%"}}
      >
        {/* <h3>Tangled Tree</h3> */}
        <TangledTree filteredData={filteredData} />

        {/* <h3>Sunburst Chart</h3> */}
        <SunburstChart filteredData={filteredData} />
      </div>
    </div>
  );
};

export default TreeView;

