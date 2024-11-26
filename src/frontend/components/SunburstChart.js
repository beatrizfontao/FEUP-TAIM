import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Tooltip from './Tooltip.js';
import { Row, Col } from 'react-bootstrap'

const SunburstChart = ({ data }) => {
  const svgRef = useRef();
  const svgContainer = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipTitle, setTooltipTitle] = useState("Default");
  const [tooltipValue, setTooltipValue] = useState("1");
  const [tooltipVisibility, setTooltipVisibility] = useState(false);
  const [title, setTitle] = useState("Overview");
  const [animateTitle, setAnimateTitle] = useState(false);

  const updateDimensions = () => {
    if (svgContainer.current) {
      setWidth(svgContainer.current.offsetWidth);
      setHeight(svgContainer.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [width, height]);

  useEffect(() => {
    d3.select(svgRef.current).select("svg").remove();



    const radius = Math.min(width, height) / 6.2; // Adjust radius
    const innerRadius = radius * 0.01; // Adjust inner radius

    const hierarchy = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    const root = d3.partition()
      .size([2 * Math.PI, hierarchy.height + 1]) // Set radial size based on hierarchy height
      (hierarchy);
    root.each(d => d.current = d);
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(innerRadius * 1.5)
      .innerRadius(d => Math.max(d.y0 * radius, innerRadius))
      .outerRadius(d => d.y1 * radius);

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, (-height / 2.2) - (height * 0.05), width, height])
      .attr("width", width)
      .attr("height", height);


    const path = svg.selectAll("path")
      .data(root.descendants().slice(1)) // Filter out the root node (flare)
      .join("path")
      .attr("d", d => arc(d)) 
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("stroke", "#fff")
      .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
      .on("mouseover", (event, d) => {
        setTooltipTitle(d.ancestors().map(d => d.data.name).reverse().filter(name => name !== "flare").join(" / "));
        setTooltipValue(`\n${format(d.value)}`);
        setTooltipPosition({ x: event.pageX, y: event.pageY });
        setTooltipVisibility(true)

      })
      .on("mouseout", () => {
        setTooltipVisibility(false)
      });

    path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    const format = d3.format(",d");

    // Add labels, excluding the root node ("flare")
    const label = svg
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().filter((d) => d.depth > 0)) // Filter out the root node (flare)
      .join("text")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .attr("dy", "0.35em")
      .text(d => truncateLabel(d.data.name, d))
      .style("font-size", "10px")

    const parent = svg.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);


    function clicked(event, p) {
      parent.datum(p.parent || root);

      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const newTitle = p.ancestors().map(d => d.data.name).reverse().filter(name => name !== "flare").join(" > ");
      setAnimateTitle(true);
      setTimeout(() => {
        setTitle(newTitle || "Overview");
        setAnimateTitle(false);
      }, 500);

      const t = svg.transition().duration(750);

      // Transition all arcs
      path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
        .attrTween("d", d => () => arc(d.current));

      label.filter(function (d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    function truncateLabel(label, d) {
      const maxChars = ((d.y1 * radius) - Math.max(d.y0 * radius, innerRadius))/6
      console.log(maxChars)
      console.log(label)
      return label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;
    }

  }, [width, height, data]);

  return (
    <div>
      <Row>
        <h1 className={`mt-3 mb-0 ${animateTitle ? 'fade-title' : ''}`}>
          {title}
        </h1>
      </Row>
      <Row>
        <Col></Col>
        <Col sm="4" md="6">
          <div ref={svgContainer} style={{ height: "85vh", justifyContent: "center", alignItems: "center" }}>
            <svg ref={svgRef}></svg>
          </div>
        </Col>
        <Col>
          {tooltipVisibility && (
            <div>
              <Tooltip title={tooltipTitle} value={tooltipValue} pos={tooltipPosition}></Tooltip>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SunburstChart;
