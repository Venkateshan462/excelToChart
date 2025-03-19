// import { Network } from "vis-network/standalone";
// import { useEffect, useRef } from "react";

// const VisNetworkChart = (hierarchy) => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const data = {
//       nodes: [],
//       edges: [],
//     };

//     let idCounter = 1;
//     const nodeMap = {};

//     const traverseHierarchy = (node, parentId = null) => {
//       const nodeId = idCounter++;
//       nodeMap[node.name] = nodeId;
//       data.nodes.push({ id: nodeId, label: node.name });

//       if (parentId !== null) {
//         data.edges.push({ from: parentId, to: nodeId });
//       }

//       if (node.children) {
//         node.children.forEach((child) => traverseHierarchy(child, nodeId));
//       }
//     };

//     traverseHierarchy(hierarchy);

//     const network = new Network(containerRef.current, data, {
//       layout: {
//         hierarchical: {
//           direction: "UD",
//           sortMethod: "directed",
//         },
//       },
//       edges: {
//         arrows: "to",
//       },
//     });

//     return () => network.destroy();
//   }, []);

//   return <div ref={containerRef} style={{ height: "500px", width: "100%" }} />;
// };

// export default VisNetworkChart;

import { Network } from "vis-network/standalone";
import { useEffect, useRef } from "react";

const VisNetworkChart = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const nodes = [];
    const edges = [];
    let idCounter = 1;
    const nodeMap = {};

    const traverse = (node, parentId = null) => {
      const nodeId = idCounter++;
      nodeMap[node.name] = nodeId;
      nodes.push({ id: nodeId, label: node.name });

      if (parentId !== null) {
        edges.push({ from: parentId, to: nodeId });
      }

      if (node.children) {
        node.children.forEach((child) => traverse(child, nodeId));
      }
    };

    traverse(data);

    const network = new Network(containerRef.current, { nodes, edges }, {
      layout: { hierarchical: { direction: "UD", sortMethod: "directed" } },
      edges: { arrows: "to" },
    });

    return () => network.destroy();
  }, [data]);

  return <div ref={containerRef} style={{ height: "500px", width: "100%" }} />;
};

export default VisNetworkChart;
