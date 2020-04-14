import React, { useState, useEffect } from "react";
import lang from "./lang";

function Table({ districts, total }) {
  const [data, setData] = useState([]);
  const [sortData, setSortData] = useState({
    sortColumn: "confirmed",
    isAscending: false,
  });

  useEffect(() => {
    if (Object.keys(districts).length > 0) {
      const tmp = [];
      for (const d in districts) {
        tmp.push({
          district: d,
          ...districts[d],
        });
      }
      setData(tmp);
    }
  }, [districts]);

  const doSort = () => {
    data.sort((StateData1, StateData2) => {
      const sortColumn = sortData.sortColumn;
      let value1 = StateData1[sortColumn];
      let value2 = StateData2[sortColumn];

      if (sortColumn !== "district") {
        value1 = parseInt(StateData1[sortColumn]);
        value2 = parseInt(StateData2[sortColumn]);
      }

      if (sortData.isAscending) {
        return value1 > value2
          ? 1
          : value1 === value2 && StateData1["district"] > StateData2["district"]
          ? 1
          : -1;
      } else {
        return value1 < value2
          ? 1
          : value1 === value2 && StateData1["district"] > StateData2["district"]
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
          : sortData.sortColumn === "state",
    });
  };

  doSort();

  return (
    <div className="flex flex-col text-mobile sm:text-sm avg:text-base fk:text-lg">
      <div className="rounded-lg bg-fiord-800 p-4 overflow-x-scroll md:overflow-hidden">
        <table className="table min-w-full">
          <thead>
            <tr>
              {Object.keys(lang).map((header, index) => {
                return (
                  <th
                    className="text-left pr-4"
                    key={index}
                    onClick={(e) => handleSort(e)}
                  >
                    <abbr className="text-red-500" title={header}>
                      {lang[header]}
                    </abbr>
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
                        className={header !== "district" ? "" : "text-blue-500"}
                        key={index}
                      >
                        {district[header]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="font-semibold py-64">
              <td>Total</td>
              {Object.keys(lang)
                .slice(1)
                .map((header, index) => {
                  return <td key={index}>{total[header]}</td>;
                })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
