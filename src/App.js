import React, { useState, useEffect } from "react";
import Map from "./components/map";
import Table from "./components/table";
import Counter from "./components/counter";
import Charts from "./components/charts";
import axios from "axios";
import lang from "./components/lang";

function App() {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState({});
  const [maxActive, setMaxActive] = useState(0);
  const [lastupdated, setLastUpdated] = useState("");
  const [summary, setSummary] = useState({});
  const [fetched, setFetched] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (fetched === false) {
      (async () => {
        let response = await axios.get(
          "https://keralastats.coronasafe.live/histories.json"
        );
        let hist = response.data.histories;
        let dist = response.data.histories[response.data.histories.length - 1];
        let mx = 0;
        for (const d in dist.summary) {
          if (dist.summary[d].active > mx) {
            mx = dist.summary[d].active;
          }
        }
        response = await axios.get(
          "https://keralastats.coronasafe.live/summary.json"
        );
        let summ = response.data;
        let keys = Object.keys(lang).splice(1);
        let tmp = [];
        hist.forEach((e) => {
          let tmpData = {};
          keys.forEach((k) => (tmpData[k] = 0));
          Object.keys(e.summary).forEach((d) => {
            keys.forEach((k) => (tmpData[k] += e.summary[d][k]));
          });
          tmp.push({
            date: e.date,
            ...tmpData,
          });
        });
        setChartData(tmp);
        setMaxActive(mx);
        setHistory(hist);
        setLatest(dist);
        setSummary(summ);
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
              <p className="leading-none font-extrabold tracking-wider text-lg sm:text-xl md:text-2xl lg:text-3xl avg:text-5xl text-center avg:text-left">
                KERALA COVID-19 TRACKER
              </p>
              <div className="pt-1 sm:pt-0 leading-tight text-mobile sm:text-sm text-center avg:text-left">
                <div>
                  <p className="inline font-semibold">Last Updated:</p>
                  {lastupdated}
                </div>
                <div>
                  <p className="inline font-semibold">Source: </p>
                  <a
                    className="inline"
                    href="http://dhs.kerala.gov.in/%E0%B4%A1%E0%B5%86%E0%B4%AF%E0%B4%BF%E0%B4%B2%E0%B4%BF-%E0%B4%AC%E0%B5%81%E0%B4%B3%E0%B5%8D%E0%B4%B3%E0%B4%B1%E0%B5%8D%E0%B4%B1%E0%B4%BF%E0%B4%A8%E0%B5%8D%E2%80%8D/"
                  >
                    Daily Bulletin, Directorate of Health Service, Government of
                    Kerala
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col pl-0 avg:pl-2">
              <Counter data={summary} />
            </div>
          </div>
          <div className="flex flex-col avg:flex-row mt-4">
            <div className="flex flex-col pl-0 avg:pl-2 avg:w-1/3">
              <Map districts={latest} summary={summary} maxActive={maxActive} />
            </div>
            <div className="flex flex-col order-last avg:order-first pr-0 avg:pr-2 avg:w-2/3">
              <div>
                <Charts data={chartData} />
              </div>
              <div className="flex-auto">
                <Table districts={latest} summary={summary} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
