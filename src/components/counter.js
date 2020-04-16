import React from "react";
import lang from "./lang";

function Counter({ data }) {
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
              <div className="leading-none font-bold text-base avg:text-lg">
                {data.summary[header]}
                <p className="xs:inline xs:ml-1 align-middle text-mobile break-normal">
                  {data.delta[header] > 0
                    ? `+${data.delta[header]}`
                    : data.delta[header] === 0
                    ? "-"
                    : data.delta[header]}
                </p>
              </div>
              <p className="font-normal text-mobile">
                {header !== "confirmed" &&
                  `${(
                    (data.summary[header] / data.summary["confirmed"]) *
                    100
                  ).toFixed(2)}%`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Counter;
