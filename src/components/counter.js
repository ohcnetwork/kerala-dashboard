import React from "react";
import { lang, statColor } from "../constants";

function Counter({ data }) {
  return (
    <div className="flex flex-row justify-start p-2 rounded-lg bg-fiord-800 max-w-none overflow-hidden">
      {Object.keys(statColor).map((header) => {
        return (
          <div
            key={header}
            className={`${statColor[header]} flex-auto avg:flex-shrink-0 max-w-none mx-1 p-1 avg:px-2 rounded-lg text-gray-900`}
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
