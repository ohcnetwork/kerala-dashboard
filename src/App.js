import React, { useState, useEffect } from "react";
import Map from "./components/map";
import Table from "./components/table";
import Counter from "./components/counter";
import axios from "axios";

function App() {
  const [districts, setDistricts] = useState({});
  const [lastupdated, setLastUpdated] = useState("");
  const [statistics, setStatistics] = useState({});
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched === false) {
      (async () => {
        const response = await axios.get("https://kerala-stats.now.sh/api");
        const dist = response.data.kerala;
        let minConfirmed = 800000;
        let maxConfirmed = 0;
        for (const d in dist) {
          if (dist[d].corona_positive < minConfirmed)
            minConfirmed = dist[d].corona_positive;
          if (dist[d].corona_positive > maxConfirmed)
            maxConfirmed = dist[d].corona_positive;
        }
        let total = {};
        let keys = Object.keys(dist[Object.keys(dist)[0]]);
        keys.forEach((k) => (total[k] = 0));
        for (const d in dist) {
          keys.forEach((k) => (total[k] += +dist[d][k]));
        }
        setDistricts(response.data.kerala);
        setStatistics({
          total: total,
          maxConfirmed: maxConfirmed,
          minConfirmed: minConfirmed,
        });
        setLastUpdated(response.data.last_updated);
        setFetched(true);
      })();
    }
  }, [fetched]);

  return (
    <div className="flex bg-fiord-900 min-h-screen min-w-full justify-center">
      {!fetched && <div className="spinner min-h-screen min-w-full"></div>}
      {fetched && (
        <div className="flex-1 flex-col p-5 font-inter text-primary overflow-hidden antialiased">
          <div className="flex flex-col avg:flex-row">
            <div className="flex-none avg:pr-2 avg:mr-auto mb-2 avg:mb-0">
              <p className="font-extrabold tracking-wider text-lg sm:text-xl md:text-2xl lg:text-3xl avg:text-5xl text-center avg:text-left">
                KERALA COVID-19 TRACKER
              </p>
              <p className="text-mobile sm:text-sm text-center avg:text-left">
                Last updated on {lastupdated} with data from Directorate of
                Health Services, Kerala
              </p>
            </div>
            <div className="flex flex-col pl-0 avg:pl-2">
              <Counter total={statistics.total} />
            </div>
          </div>
          <div className="flex flex-col avg:flex-row mt-4">
            <div className="flex flex-col pl-0 avg:pl-2 avg:w-1/3">
              <Map
                districts={districts}
                total={statistics.total}
                maxConfirmed={statistics.maxConfirmed}
              />
            </div>
            <div className="flex flex-col order-last avg:order-first pr-0 avg:pr-2 avg:w-2/3">
              <Table districts={districts} total={statistics.total} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
