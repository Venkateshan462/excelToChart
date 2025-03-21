// import React, { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import * as XLSX from "xlsx";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const PharmaProcessTree = () => {
//   const [data, setData] = useState(null);
//   const [filteredData, setFilteredData] = useState(null);
//   const [levels, setLevels] = useState([]);
//   const [selectedLevels, setSelectedLevels] = useState(new Set());
//   const svgRef = useRef();
//   const chartRef = useRef();

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const binaryStr = e.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });

//       const hierarchyData = {
//         name: "Pharma_processMap",
//         children: workbook.SheetNames.map((sheetName) => {
//           const sheet = workbook.Sheets[sheetName];
//           const json = XLSX.utils.sheet_to_json(sheet);
//           return {
//             name: sheetName,
//             children: convertToHierarchy(json),
//           };
//         }),
//       };

//       const root = d3.hierarchy(hierarchyData);
//       setData(root);
//       extractLevels(root);
//       setFilteredData(root);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const convertToHierarchy = (rows) => {
//     let tree = {};
//     rows.forEach((row) => {
//       let levels = Object.values(row);
//       let currentLevel = tree;
//       levels.forEach((level) => {
//         if (!currentLevel[level]) {
//           currentLevel[level] = {};
//         }
//         currentLevel = currentLevel[level];
//       });
//     });

//     const buildTree = (obj, name = "") => {
//       const children = Object.entries(obj).map(([key, value]) =>
//         buildTree(value, key)
//       );
//       return { name, children: children.length ? children : [] };
//     };

//     return buildTree(tree).children;
//   };

//   const extractLevels = (root) => {
//     let levelsSet = new Set();
//     const traverse = (node, level = 0) => {
//       if (level > 0) {
//         levelsSet.add(`Level ${level}`);
//       }
//       node.children?.forEach((child) => traverse(child, level + 1));
//     };
//     traverse(root);
//     const levelArray = [...Array.from(levelsSet).sort()];
//     setLevels(levelArray);
//     setSelectedLevels(new Set(levelArray));
//   };

//   const filterByLevels = (node, selectedLevels, level = 0) => {
//     if (!node) return null;

//     // Root and Level 1 should always be included
//     if (level === 0 || level === 1) {
//       return {
//         ...node,
//         children: node.children
//           ?.map((child) => filterByLevels(child, selectedLevels, level + 1))
//           .filter(Boolean),
//       };
//     }

//     if (!selectedLevels.has(`Level ${level}`)) return null;

//     return {
//       ...node,
//       children: node.children
//         ?.map((child) => filterByLevels(child, selectedLevels, level + 1))
//         .filter(Boolean),
//     };
//   };

//   useEffect(() => {
//     if (!data) return;
//     const filtered =
//       selectedLevels.size === 0
//         ? data
//         : d3.hierarchy(filterByLevels(data.data, selectedLevels));
//     setFilteredData(filtered);
//   }, [selectedLevels, data]);

//   useEffect(() => {
//     if (!filteredData) return;

//     const width = 2200;
//     const height = 2000;
//     const margin = { top: 80, right: 80, bottom: 80, left: 200 };

//     d3.select(svgRef.current).selectAll("*").remove();
//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     const treeLayout = d3.tree().size([height - 400, width - 1500]);
//     treeLayout.separation((a, b) => (a.parent === b.parent ? 2.5 : 3.5));

//     treeLayout(filteredData);

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     const updateTree = () => {
//       treeLayout(filteredData);

//       const nodes = svg
//         .selectAll(".node")
//         .data(filteredData.descendants(), (d) => d.id);
//       const links = svg
//         .selectAll(".link")
//         .data(filteredData.links(), (d) => d.target.id);

//       links
//         .enter()
//         .append("path")
//         .attr("class", "link")
//         .merge(links)
//         .attr("fill", "none")
//         .attr("stroke", (d) => colorScale(d.source.depth))
//         .attr("stroke-width", 2)
//         .attr(
//           "d",
//           d3
//             .linkVertical()
//             .x((d) => d.y)
//             .y((d) => d.x)
//         );

//       links.exit().remove();

//       const node = nodes
//         .enter()
//         .append("g")
//         .attr("class", "node")
//         .attr("transform", (d) => `translate(${d.y},${d.x})`);

//       node
//         .append("circle")
//         .attr("r", 3)
//         .attr("fill", (d) => colorScale(d.depth));

//       node
//         .append("text")
//         .attr("dy", ".35em")
//         .attr("x", (d) => (d.children ? -30 : 20))
//         .style("text-anchor", (d) => (d.children ? "end" : "start"))
//         .style("font-size", "11px")
//         .style("line-height", "1.5") // Added line height for better spacing
//         .text((d) => d.data.name);

//       nodes.exit().remove();
//     };

//     updateTree();
//   }, [filteredData]);

//   const handleCheckboxChange = (level) => {
//     setSelectedLevels((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(level)) {
//         newSet.delete(level);
//       } else {
//         newSet.add(level);
//       }
//       return new Set(newSet);
//     });
//   };

//   const exportToPDF = () => {
//     html2canvas(chartRef.current).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("landscape");
//       pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
//       pdf.save("Pharma_Process_Tree.pdf");
//     });
//   };

//   return (
//     <div>
//       <div className="treeupload" style={{float: 'left', width: '80%'}}>
//         <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//         <div>
//           {levels.map((level, index) => (
//             <label key={index} style={{ marginRight: "10px" }}>
//               <input
//                 type="checkbox"
//                 checked={selectedLevels.has(level)}
//                 onChange={() => handleCheckboxChange(level)}
//                 disabled={level === "Level 1"}
//               />
//               {level}
//             </label>
//           ))}
//         </div>
//       </div>
//       <div className="treebtn" style={{float: 'right', width: '20%'}}>
//         <button className="" style={{float:'right', background: '#001ae5', color: '#fff', padding: '6px', border:'#001ae5'}} onClick={exportToPDF}>Export PDF</button>
//       </div>
//       <div ref={chartRef}>
//         <svg ref={svgRef}></svg>
//       </div>
//     </div>
//   );
// };

// export default PharmaProcessTree;

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { jsPDF } from "jspdf";
import { Canvg } from "canvg";
import jsonData from "../Pharma_ProcessMap.json";

const PharmaProcessTree = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [treeData, setTreeData] = useState(null);
  const [levels, setLevels] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  const [categories, setCategories] = useState({
    Research: true,
    Development: true,
    Commercial: true,
  });

  useEffect(() => {
    if (!jsonData) return;
    const root = d3.hierarchy(jsonData);
    setTreeData(root);
  }, []);

  function filterHierarchy(node, levelFilter, nameFilter, level = 1) {
    if (!levelFilter[level] || nameFilter[node.name] === false) {
      return null;
    }
    const filteredChildren = node.children
      ? node.children
          .map((child) =>
            filterHierarchy(child, levelFilter, nameFilter, level + 1)
          )
          .filter(Boolean)
      : [];
    return {
      name: node.name,
      children: filteredChildren.length ? filteredChildren : null,
    };
  }

  useEffect(() => {
    if (!treeData) return;

    const treeRoot = d3.hierarchy(
      filterHierarchy(jsonData, levels, categories)
    );

    const width = 1800;
    const height = 2000;
    const margin = { top: 80, right: 80, bottom: 80, left: 200 };

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree().size([height - 100, width - 900]);
    const treeDataProcessed = treeLayout(treeRoot);

    const linkColorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const filteredNodes = treeDataProcessed.descendants();
    const filteredLinks = treeDataProcessed.links();

    // Draw Links
    svg
      .selectAll(".link")
      .data(filteredLinks)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d) => linkColorScale(d.target.depth))
      .attr("stroke-width", 2.5)
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.y)
          .y((d) => d.x)
      );

    // Draw Nodes
    const nodeEnter = svg
      .selectAll(".node")
      .data(filteredNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodeEnter
      .append("circle")
      .attr("r", 6)
      .attr("fill", "steelblue")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function () {
        d3.select(this).attr("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "steelblue");
      });

    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => (d.children ? -30 : 20))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("font-size", "11px")
      .attr("fill", "black")
      .text((d) => d.data.name);
  }, [treeData, levels, categories]);

  const handleLevelChange = (level) => {
    setLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  const handleCategoryChange = (category) => {
    setCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const exportPDF = async () => {
    const svgElement = svgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 2200;
    canvas.height = 2000;

    // Convert SVG to Canvas using Canvg
    const v = await Canvg.from(
      ctx,
      new XMLSerializer().serializeToString(svgElement)
    );
    await v.render();

    // Convert Canvas to Image
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [2200, 2000],
    });

    // Add image to PDF and Save
    pdf.addImage(imgData, "PNG", 10, 10, 2100, 1900);
    pdf.save("Pharma_Process_Tree.pdf");
  };

  return (
    <div ref={containerRef}>
      <div className="treeupload" style={{ float: "left", width: "80%" }}>
        <div>
          <strong>Filter by Category:</strong>
          {Object.keys(categories).map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                checked={categories[category]}
                onChange={() => handleCategoryChange(category)}
              />{" "}
              {category}
            </label>
          ))}
        </div>
        <div>
          <strong>Filter by Level:</strong>
          {Object.keys(levels).map((level) => (
            <label key={level}>
              <input
                type="checkbox"
                checked={levels[level]}
                onChange={() => handleLevelChange(level)}
                disabled={level === "1"}
              />{" "}
              Level {level}
            </label>
          ))}
        </div>
      </div>
      <div className="treebtn" style={{ float: "right", width: "20%" }}>
        <button
          style={{
            float: "right",
            background: "#001ae5",
            color: "#fff",
            padding: "6px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={exportPDF}
        >
          Export to PDF
        </button>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PharmaProcessTree;

