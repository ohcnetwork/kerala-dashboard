import React, { useState, useEffect } from "react";
import lang from "./lang";

function Counter(props) {
  const districts = props.districts;
  const [total, setTotal] = useState({});
  useEffect(() => {
    if (Object.keys(districts).length > 0) {
      let tmpTotal = {};
      let keys = Object.keys(districts[Object.keys(districts)[0]]);
      keys.forEach(k => (tmpTotal[k] = 0));
      for (const d in districts) {
        keys.forEach(k => (tmpTotal[k] += +districts[d][k]));
      }
      setTotal(tmpTotal);
    }
  }, [districts]);

  const topBox = {
    corona_positive: "bg-red-500",
    under_home_isolation: "bg-yellow-500",
    cured_discharged: "bg-green-500",
    deaths: "bg-gray-500"
  };

  return (
    <div className="flex flex-row justify-start p-2 rounded-lg bg-fiord-800 max-w-none overflow-hidden">
      {Object.keys(topBox).map(header => {
        return (
          <div
            key={header}
            className={
              topBox[header] +
              " flex-auto avg:flex-shrink-0 max-w-none mx-1 p-1 avg:px-2 rounded-lg text-gray-900 "
            }
          >
            <div>
              <p className="font-medium uppercase text-xs avg:text-base">
                {lang[header]}
              </p>
              <p className="font-bold text-base avg:text-lg">{total[header]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Counter;
