import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CollapsibleTree = (data) => {
  const treeData = data.data;
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 1000;
    const height = 600;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50,50)");

    const treeLayout = d3.tree().size([height - 100, width - 200]);

    const root = d3.hierarchy(treeData);
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
        d._children.forEach(collapse);
      }
    }

    root.children.forEach(collapse);
    update(root);

    function update(source) {
      treeLayout(root);

      const nodes = root.descendants();
      const links = root.links();

      nodes.forEach((d) => {
        d.y = d.depth * 180;
      });

      const node = svg
        .selectAll("g.node")
        .data(nodes, (d) => d.id || (d.id = Math.random()));

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter.append("circle").attr("r", 6).attr("fill", "steelblue");

      nodeEnter
        .append("text")
        .attr("dy", 4)
        .attr("x", (d) => (d.children ? -12 : 12))
        .style("text-anchor", (d) => (d.children ? "end" : "start"))
        .text((d) => d.data.name);

      const nodeUpdate = nodeEnter.merge(node);
      nodeUpdate
        .transition()
        .duration(500)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      node
        .exit()
        .transition()
        .duration(500)
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .remove();

      const link = svg.selectAll("path.link").data(links, (d) => d.target.id);

      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return d3.linkHorizontal()({ source: o, target: o });
        });

      linkEnter
        .merge(link)
        .transition()
        .duration(500)
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );

      link
        .exit()
        .transition()
        .duration(500)
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return d3.linkHorizontal()({ source: o, target: o });
        })
        .remove();

      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
  }, [treeData]);

  return <svg ref={svgRef} />;
};

export default CollapsibleTree;
