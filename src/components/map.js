import React, { useState, useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
import * as topojson from "topojson";
import lang from "./lang";
import { useWindowWidth } from "@react-hook/window-size/throttled";

function Map({ districts, summary, maxActive }) {
  const [district, setDistrict] = useState({});
  const [renderData, setRenderData] = useState(null);
  const [curLang, setCurLang] = useState([]);
  const [mapHeight, setMapHeight] = useState(0);
  const [legendPos, setLegendPos] = useState(0);
  const width = useWindowWidth(450, { fps: 30, leading: true, wait: 0 });
  const map = useRef(null);

  const resetDistrict = useCallback(() => {
    setDistrict({
      name: "All Districts",
      ...summary.summary,
      delta: summary.delta,
    });
  }, [summary.delta, summary.summary]);

  useEffect(() => {
    if (renderData) {
      d3.selectAll("svg#chart > *").remove();
      const svg = d3.select(map.current);
      const topology = topojson.feature(
        renderData,
        renderData.objects.kerala_district
      );
      const projection = d3.geoMercator();
      projection.fitHeight(mapHeight, topology);
      const path = d3.geoPath(projection);
      const maxInterpolation = 0.8;
      const color = d3
        .scaleSequential(d3.interpolateReds)
        .domain([0, maxActive / maxInterpolation]);
      svg
        .append("g")
        .attr("class", "kerala")
        .selectAll("path")
        .data(topology.features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
          const n = districts.summary[d.properties.district].active;
          return n === 0
            ? "#ffffff"
            : d3.interpolateReds((maxInterpolation * n) / maxActive);
        })
        .attr("d", path)
        .attr("pointer-events", "all")
        .on("mouseenter", (d) => {
          if (districts.summary[d.properties.district]) {
            const current = d.properties.district;
            setDistrict({
              name: current,
              ...districts.summary[current],
              delta: districts.delta[current],
            });
          }
          const target = d3.event.target;
          d3.select(target.parentNode.appendChild(target))
            .attr("stroke", "#ff073a")
            .attr("stroke-width", 2);
        })
        .on("mouseleave", (d) => {
          resetDistrict();
          const target = d3.event.target;
          d3.select(target).attr("stroke", "None");
        })
        .style("cursor", "pointer")
        .append("title")
        .text(function (d) {
          return `${parseFloat(
            100 *
              (parseInt(districts.summary[d.properties.district].active) /
                summary.summary.active)
          ).toFixed(2)}% from ${d.properties.district}`;
        });
      svg
        .append("path")
        .attr("stroke", "#ff073a20")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr(
          "d",
          path(topojson.mesh(renderData, renderData.objects.kerala_district))
        );
      svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(5,${legendPos})`);
      const numCells = 6;
      const delta = Math.floor(
        (maxActive < numCells ? numCells : maxActive) / (numCells - 1)
      );
      const cells = Array.from(Array(numCells).keys()).map((i) => i * delta);
      function label({ i, genLength, generatedLabels }) {
        if (i === genLength - 1) {
          const n = Math.floor(generatedLabels[i]);
          return `${n}+`;
        } else {
          const n1 = 1 + Math.floor(generatedLabels[i]);
          const n2 = Math.floor(generatedLabels[i + 1]);
          return `${n1} - ${n2}`;
        }
      }
      const legend = legendColor()
        .shapeWidth(30)
        .cells(cells)
        .titleWidth(3)
        .labels(label)
        .title("Active Cases")
        .orient("vertical")
        .scale(color);
      svg.select(".legend").call(legend);
    }
  }, [
    district,
    districts,
    legendPos,
    mapHeight,
    maxActive,
    renderData,
    resetDistrict,
    summary,
    summary.active,
    width,
  ]);

  useEffect(() => {
    if (
      Object.keys(districts.summary).length > 0 &&
      map.current &&
      summary.summary.active
    ) {
      (async () => {
        resetDistrict();
        const kerala = await d3.json("/kerala.json");
        setRenderData(kerala);
      })();
    }
  }, [districts.summary, resetDistrict, summary.summary.active]);

  useEffect(() => {
    if (width > 1440) {
      setCurLang(Object.keys(lang).slice(1));
      setMapHeight(600);
      setLegendPos(420);
    } else if (width >= 500) {
      setCurLang(Object.keys(lang).slice(1));
      setMapHeight(545);
      setLegendPos(365);
    } else if (width > 370) {
      setCurLang(Object.keys(lang).reverse().slice(0, 8));
      setMapHeight(450);
      setLegendPos(325);
    } else {
      setCurLang(Object.keys(lang).slice(1, 5));
      setMapHeight(450);
      setLegendPos(325);
    }
  }, [width]);

  return (
    <div className="flex flex-col relative rounded-lg p-4 bg-fiord-800 avg:mb-0 min-w-full min-h-full">
      <svg
        className="z-0 min-h-full min-w-full text-mobile xs:text-base"
        id="chart"
        height={mapHeight}
        ref={map}
      ></svg>
      <div
        className={
          "z-40 flex flex-grow flex-col absolute top-0 right-0 text-right text-mobile xs:text-base min-h-full items-end"
        }
        style={{ pointerEvents: "none" }}
      >
        <div className="m-2 sm:px-2 px-1 sm:px-2 py-1 rounded-md bg-gradient-r-fiord-700 font-semibold">
          <p className="text-sm xs:text-lg lg:text-xl">{district.name}</p>
        </div>
        {curLang.map((k, i) => {
          return (
            <div
              key={i}
              className="mx-2 my-1 sm:my-1 px-1 sm:px-2 py-1 rounded-md bg-gradient-r-fiord-700 max-w-none"
            >
              <p>{lang[k]}</p>
              <div className="font-medium">
                {district[k]}
                <p className="inline text-mobile ml-1 text-fiord-400">
                  {district.delta[k] > 0
                    ? `+${district.delta[k]}`
                    : district.delta[k] === 0
                    ? "-"
                    : district.delta[k]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Map;
