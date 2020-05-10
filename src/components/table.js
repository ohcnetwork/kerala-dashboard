import React, { useEffect, useState } from "react";
import { lang, zoneColor } from "../constants";

function Table({ districts, summary, zones }) {
  const [data, setData] = useState([]);
  const [sortData, setSortData] = useState({
    sortColumn: "confirmed",
    isAscending: false,
  });

  useEffect(() => {
    if (Object.keys(districts.summary).length > 0) {
      const tmp = [];
      for (const d in districts.summary) {
        tmp.push({
          district: d,
          ...districts.summary[d],
          delta: districts.delta[d],
        });
      }
      setData(tmp);
    }
  }, [districts]);

  const doSort = () => {
    data.sort((data1, data2) => {
      const sortColumn = sortData.sortColumn;
      let value1 = data1[sortColumn];
      let value2 = data2[sortColumn];

      if (sortColumn !== "district") {
        value1 = parseInt(data1[sortColumn]);
        value2 = parseInt(data2[sortColumn]);
      }
      if (sortData.isAscending) {
        return value1 > value2
          ? 1
          : value1 === value2 && data1["district"] > data2["district"]
          ? 1
          : -1;
      } else {
        return value1 < value2
          ? 1
          : value1 === value2 && data1["district"] > data2["district"]
          ? 1
          : -1;
      }
    });
  };

  const handleSort = (e) => {
    const currentsortColumn = e.currentTarget
      .querySelector("abbr")
      .getAttribute("title")
      .toLowerCase();
    setSortData({
      sortColumn: currentsortColumn,
      isAscending:
        sortData.sortColumn === currentsortColumn
          ? !sortData.isAscending
          : sortData.sortColumn === "district",
    });
  };

  doSort();

  return (
    <div className="flex rounded-lg bg-fiord-800 p-2 avg:p-4 overflow-x-scroll lg:overflow-hidden text-mobile lg:text-xs avg:text-sm fk:text-base h-full justify-center">
      <table className="table min-h-full min-w-full">
        <thead>
          <tr>
            {Object.keys(lang).map((header, index) => {
              return (
                <th
                  className={`text-left pr-2 last:pr-0 ${
                    header !== "district" ? "text-center" : ""
                  }`}
                  key={index}
                  onClick={(e) => handleSort(e)}
                >
                  <abbr title={header}>{lang[header]}</abbr>
                  {sortData.sortColumn === header && <span>*</span>}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((district, index) => {
            return (
              <tr key={index}>
                {Object.keys(lang).map((header, index) => {
                  return (
                    <td
                      className={
                        header !== "district"
                          ? "text-center"
                          : zoneColor[zones[district[header]]]
                      }
                      key={index}
                    >
                      {district[header]}
                      <span className="text-fiord-400 ml-1 text-mobilexs xs:text-mobile truncate">
                        {district["delta"][header] > 0
                          ? `+${district["delta"][header]}`
                          : district["delta"][header] === 0
                          ? "-"
                          : district["delta"][header]}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr className="font-semibold">
            <td>Total</td>
            {Object.keys(lang)
              .slice(1)
              .map((header, index) => {
                return (
                  <td
                    className={header !== "district" ? "text-center" : ""}
                    key={index}
                  >
                    {summary.summary[header]}
                    <p className="text-fiord-400 inline ml-1 text-mobilexs xs:text-mobile truncate">
                      {summary.delta[header] > 0
                        ? `+${summary.delta[header]}`
                        : summary.delta[header] === 0
                        ? "-"
                        : summary.delta[header]}
                    </p>
                  </td>
                );
              })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
