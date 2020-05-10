import React from "react";

function Links() {
  return (
    <div className="flex flex-initial flex-row min-w-full rounded-lg avg2:mb-0 space-y-2 bg-fiord-800 p-4 justify-between text-xs avg:text-sm font-semibold">
      <a className="mt-2" href="https://coronasafe.network/">
        <img
          className="w-16 avg2:w-20 object-contain"
          src={require("../assets/img/coronaSafeLogo.svg")}
          title="CoronaSafe: Corona Literacy Mission"
          alt="CoronaSafe Logo: Corona Literacy Mission"
        />
      </a>
      <a href="https://hotspots.coronasafe.network/">
        <span>Hotspots Map</span>
      </a>
      <a href="https://github.com/coronasafe/kerala_map/">Github</a>
      <a href="https://github.com/coronasafe/kerala_stats/">API</a>
    </div>
  );
}

export default Links;
