import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TreeView = ({ data }) => {
  const [treeData, setTreeData] = useState([]);
  const treeContainerRef = useRef(null);

  useEffect(() => {
    if (data) {
      setTreeData([data]);
    }
  }, [data]);

  const exportToPDF = () => {
    if (!treeContainerRef.current) return;

    html2canvas(treeContainerRef.current, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a2");
      const imgWidth = 290; // Adjust width for A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("tree-structure.pdf");
    });
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const maxCharsPerLine = 12;
    const maxLines = 2;
    const words = nodeDatum.name.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    if (lines.length > maxLines) {
      lines.splice(maxLines);
      lines[maxLines - 1] += "...";
    }

    const textHeight = 18;
    const boxPadding = 5;
    const boxWidth = 150;
    const boxHeight = lines.length * textHeight + boxPadding * 2;

    return (
      <g>
        <circle
          r={10}
          fill="steelblue"
          onClick={toggleNode}
          style={{ cursor: "pointer" }}
        />

        <rect
          x={-boxWidth / 2}
          y={15}
          width={boxWidth}
          height={boxHeight}
          fill="white"
          stroke="black"
          rx={5}
          ry={5}
        />

        {lines.map((line, i) => (
          <text
            key={i}
            x={0}
            y={30 + i}
            textAnchor="middle"
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              fontWeight: "normal",
              letterSpacing: "1.5px",
              lineHeight: "1.2em",
            }}
          >
            <tspan x="0" dy={i === 0 ? "0" : "1.2em"}>
              {line}
            </tspan>
          </text>
        ))}
      </g>
    );
  };

  return (
    <div>
      <button
        onClick={exportToPDF}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Export as PDF
      </button>
      <div ref={treeContainerRef} style={{ width: "100%", height: "100vh" }}>
        {treeData.length > 0 && (
          <Tree
            data={treeData}
            orientation="horizontal"
            translate={{ x: 500, y: 300 }}
            zoomable={true}
            collapsible={true}
            initialDepth={2}
            nodeSize={{ x: 250, y: 120 }}
            pathFunc="step"
            renderCustomNodeElement={renderCustomNode}
          />
        )}
      </div>
    </div>
  );
};

export default TreeView;
