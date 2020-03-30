import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
import * as topojson from "topojson";
import lang from "./lang";

function Map(props) {
  const districts = props.districts;
  const [district, setDistrict] = useState({});
  const [statistic, setStatistic] = useState({});
  const map = useRef(null);

  useEffect(() => {
    if (Object.keys(districts).length > 0 && map.current) {
      const first = Object.keys(districts)[0];
      setDistrict({
        name: first,
        under_observation: districts[first].under_observation,
        under_home_isolation: districts[first].under_home_isolation,
        total_hospitalised: districts[first].total_hospitalised,
        hospitalised_today: districts[first].hospitalised_today,
        corona_positive: districts[first].corona_positive,
        cured_discharged: districts[first].cured_discharged,
        deaths: districts[first].deaths
      });
      let total = 0;
      let minConfirmed = 800000;
      let maxConfirmed = 0;
      for (const d in districts) {
        total += districts[d].corona_positive;
        if (districts[d].corona_positive < minConfirmed)
          minConfirmed = districts[d].corona_positive;
        if (districts[d].corona_positive > maxConfirmed)
          maxConfirmed = districts[d].corona_positive;
      }
      setStatistic({
        total: total,
        maxConfirmed: maxConfirmed,
        minConfirmed: minConfirmed
      });

      const svg = d3.select(map.current);

      const width = 450;
      const height = 800;

      const projection = d3
        .geoMercator()
        .center([76.85, 9.3])
        .scale(height * 8)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath(projection);

      // Colorbar
      const maxInterpolation = 0.8;

      function label({ i, genLength, generatedLabels }) {
        if (i === genLength - 1) {
          const n = Math.floor(generatedLabels[i]);
          return `${n}+`;
        } else {
          const n1 = Math.floor(generatedLabels[i]);
          const n2 = Math.floor(generatedLabels[i + 1]);
          return `${n1} - ${n2}`;
        }
      }

      const color = d3
        .scaleSequential(d3.interpolateReds)
        .domain([0, statistic.maxConfirmed / maxInterpolation]);

      svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(5, 350)");

      const numCells = 6;
      const delta = Math.floor(statistic.maxConfirmed / (numCells - 1));
      const cells = Array.from(Array(numCells).keys()).map(i => i * delta);

      const legend = legendColor()
        .shapeWidth(30)
        .cells(cells)
        .titleWidth(3)
        .labels(label)
        .title("Confirmed Cases")
        .orient("vertical")
        .scale(color);

      svg.select(".legend").call(legend);

      const promises = [d3.json("/kerala.json")];

      Promise.all(promises).then(ready);

      function ready([kerala]) {
        svg
          .append("g")
          .attr("class", "kerala")
          .selectAll("path")
          .data(topojson.feature(kerala, kerala.objects.kerala).features)
          .enter()
          .append("path")
          .attr("fill", function(d) {
            const n = districts[d.properties.DISTRICT].corona_positive;
            return d3.interpolateReds(
              (d.confirmed =
                (n > 0) * 0.05 +
                (n / statistic.maxConfirmed) * maxInterpolation)
            );
          })
          .attr("d", path)
          .attr("pointer-events", "all")
          .on("mouseenter", d => {
            if (districts[d.properties.DISTRICT]) {
              const current = d.properties.DISTRICT;
              setDistrict({
                name: current,
                under_observation: districts[current].under_observation,
                under_home_isolation: districts[current].under_home_isolation,
                total_hospitalised: districts[current].total_hospitalised,
                hospitalised_today: districts[current].hospitalised_today,
                corona_positive: districts[current].corona_positive,
                cured_discharged: districts[current].cured_discharged,
                deaths: districts[current].deaths
              });
            }
            const target = d3.event.target;
            d3.select(target.parentNode.appendChild(target))
              .attr("stroke", "#ff073a")
              .attr("stroke-width", 2);
          })
          .on("mouseleave", d => {
            const target = d3.event.target;
            d3.select(target).attr("stroke", "None");
          })
          .style("cursor", "pointer")
          .append("title")
          .text(function(d) {
            return (
              parseFloat(
                800 *
                  (parseInt(districts[d.properties.DISTRICT].corona_positive) /
                    statistic.total)
              ).toFixed(2) +
              "% from " +
              d.properties.DISTRICT
            );
          });

        svg
          .append("path")
          .attr("stroke", "#ff073a20")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("d", path(topojson.mesh(kerala, kerala.objects.kerala)));
      }
    }
  }, [districts, statistic.maxConfirmed, statistic.total]);

  return (
    <div className="flex relative rounded-lg p-4 bg-fiord-800 mb-4 avg:mb-0 min-w-full">
      <svg className="z-0" id="chart" height="517" ref={map}></svg>
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
