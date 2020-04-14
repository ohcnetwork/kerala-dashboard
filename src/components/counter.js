import React from "react";
import lang from "./lang";

function Counter({ total }) {
  const topBox = {
    confirmed: "bg-red-500",
    active: "bg-yellow-500",
    recovered: "bg-green-500",
    deceased: "bg-gray-500",
  };

  return (
    <div className="flex flex-row justify-start p-2 rounded-lg bg-fiord-800 max-w-none overflow-hidden">
      {Object.keys(topBox).map((header) => {
        return (
          <div
            key={header}
            className={`${topBox[header]} flex-auto avg:flex-shrink-0 max-w-none mx-1 p-1 avg:px-2 rounded-lg text-gray-900`}
          >
            <div>
              <p className="font-medium uppercase text-mobile xs:text-base">
                {lang[header]}
              </p>
              <p className="leading-none font-bold text-base avg:text-lg">
                {total[header]}
              </p>
              <p className="font-normal text-mobile ">
                {header !== "confirmed" &&
                  `${((total[header] / total["confirmed"]) * 100).toFixed(2)}%`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Counter;
