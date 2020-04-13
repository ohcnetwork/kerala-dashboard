import React, { useState, useEffect, useCallback,useRef } from "react";
import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
import * as topojson from "topojson";
import lang from "./lang";

function Map({ districts, total, maxConfirmed }) {
  const [district, setDistrict] = useState({});
  const map = useRef(null);

  const resetDistrict = useCallback(() => {
    setDistrict({
      name: "All Districts",
      ...total,
    });
  },[total]);
  
  useEffect(() => {
    if (Object.keys(districts).length > 0 && map.current && total.corona_positive) {
      (async () => {
        resetDistrict()

        const svg = d3.select(map.current);

        const width = 450;
        const height = 800;

        const projection = d3
          .geoMercator()
          .center([76.85, 9.3])
          .scale(height * 8)
          .translate([width / 2, height / 2]);

        const path = d3.geoPath(projection);

        const maxInterpolation = 0.8;
        const color = d3
          .scaleSequential(d3.interpolateReds)
          .domain([0, maxConfirmed / maxInterpolation]);

        svg
          .append("g")
          .attr("class", "legend")
          .attr("transform", "translate(5, 350)");

        const numCells = 6;
        const delta = Math.floor(
          (maxConfirmed < numCells ? numCells : maxConfirmed) / (numCells - 1)
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
          .title("Confirmed Cases")
          .orient("vertical")
          .scale(color);

        svg.select(".legend").call(legend);

        const kerala = await d3.json("/kerala.json");
        svg
          .append("g")
          .attr("class", "kerala")
          .selectAll("path")
          .data(
            topojson.feature(kerala, kerala.objects.kerala_district).features
          )
          .enter()
          .append("path")
          .attr("fill", function (d) {
            const n = districts[d.properties.district].corona_positive;
            return d3.interpolateReds((maxInterpolation * n) / maxConfirmed);
          })
          .attr("d", path)
          .attr("pointer-events", "all")
          .on("mouseenter", (d) => {
            if (districts[d.properties.district]) {
              const current = d.properties.district;
              setDistrict({
                name: current,
                ...districts[current],
              });
            }
            const target = d3.event.target;
            d3.select(target.parentNode.appendChild(target))
              .attr("stroke", "#ff073a")
              .attr("stroke-width", 2);
          })
          .on("mouseleave", (d) => {
            resetDistrict()
            const target = d3.event.target;
            d3.select(target).attr("stroke", "None");
          })
          .style("cursor", "pointer")
          .append("title")
          .text(function (d) {
            return (
              parseFloat(
                100 *
                  (parseInt(districts[d.properties.district].corona_positive) /
                    total.corona_positive)
              ).toFixed(2) +
              "% from " +
              d.properties.district
            );
          });

        svg
          .append("path")
          .attr("stroke", "#ff073a20")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr(
            "d",
            path(topojson.mesh(kerala, kerala.objects.kerala_district))
          );
      })();
    }
  }, [districts, maxConfirmed, resetDistrict, total.corona_positive]);

  return (
    <div className="flex relative rounded-lg p-4 bg-fiord-800 mb-4 avg:mb-0 min-w-full">
      <svg className="z-0" id="chart" height="535" ref={map}></svg>
      <div
        className="z-40 flex-col absolute top-0 right-0 text-right text-xs md:text-base"
        style={{ pointerEvents: "none" }}
      >
        <div className="flex-col m-2 px-2 py-1 rounded-md bg-gradient-r-fiord-700 font-semibold">
          <p className="text-base lg:text-xl">{district.name}</p>
        </div>
        {Object.keys(lang)
          .slice(1)
          .map((k, i) => {
            return (
              <div className="flex-col m-2 px-2 py-1 rounded-md bg-gradient-r-fiord-700">
                <p>{lang[k]}</p>
                <p className="font-medium">{district[k]}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Map;
