import React, { useState, useEffect } from "react";
import lang from "./lang";

function Table(props) {
  const districts = props.districts;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({});
  const [sortData, setSortData] = useState({
    sortColumn: "corona_positive",
    isAscending: false
  });
  useEffect(() => {
    if (Object.keys(districts).length > 0) {
      let tmpTotal = {};
      let keys = Object.keys(districts[Object.keys(districts)[0]]);
      keys.forEach(k => (tmpTotal[k] = 0));
      const tmp = [];
      for (const d in districts) {
        tmp.push({
          district: d,
          ...districts[d]
        });
        keys.forEach(k => (tmpTotal[k] += +districts[d][k]));
      }
      setTotal(tmpTotal);
      setData(tmp);
    }
  }, [districts]);

  const doSort = (e, props) => {
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

  const handleSort = (e, props) => {
    const currentsortColumn = e.currentTarget
      .querySelector("abbr")
      .getAttribute("title")
      .toLowerCase();
    setSortData({
      sortColumn: currentsortColumn,
      isAscending:
        sortData.sortColumn === currentsortColumn
          ? !sortData.isAscending
          : sortData.sortColumn === "state"
    });
  };

  doSort();

  const getHeading = () => {
    return lang;
  };

  return (
    <div className="flex-none flex-col text-base text-gray-800 px-1 mt-4 sm:mt-0">
      <table className="table-auto min-w-full">
        <thead>
          <tr>
            {Object.keys(getHeading()).map((header, index) => {
              return (
                <th
                  className="text-left pr-4"
                  key={index}
                  onClick={e => handleSort(e, props)}
                >
                  <abbr className="text-red-500" title={header}>
                    {getHeading()[header]}
                  </abbr>
                  {sortData.sortColumn === header && (
                    <span className="text-gray-500">*</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((district, index) => {
            return (
              <tr key={index}>
                {Object.keys(getHeading()).map((header, index) => {
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
            {Object.keys(getHeading()).map((header, index) => {
              if (index !== 0) {
                return <td key={index}>{total[header]}</td>;
              }
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
