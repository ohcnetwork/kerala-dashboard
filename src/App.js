import axios from "axios";
import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader";
import Charts from "./components/charts";
import Counter from "./components/counter";
import Hotspots from "./components/hotspots";
import Links from "./components/links";
import Map from "./components/map";
import Table from "./components/table";
import Testing from "./components/testing";
import { lang } from "./constants";

function App() {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState({});
  const [maxActive, setMaxActive] = useState(0);
  const [lastupdated, setLastUpdated] = useState("");
  const [summary, setSummary] = useState({});
  const [hotspots, setHotspots] = useState({});
  const [testReport, setTestReport] = useState({});
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
        Object.keys(dist.summary).forEach(
          (d) =>
            (mx = dist.summary[d].active > mx ? dist.summary[d].active : mx)
        );
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
        response = await axios.get(
          "https://keralastats.coronasafe.live/testreports.json"
        );
        let tr = response.data.reports[response.data.reports.length - 1];
        response = await axios.get(
          "https://keralastats.coronasafe.live/hotspots.json"
        );
        let k1 = "district";
        let k2 = "lsgd";
        let hpts = response.data.hotspots.reduce(
          (a, b) => ({
            ...a,
            [b[k1]]: a[b[k1]] ? a[b[k1]].concat(b[k2]) : [b[k2]],
          }),
          {}
        );
        setTestReport(tr);
        setHotspots(hpts);
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
    <div className="flex justify-center min-w-full min-h-screen overflow-hidden antialiased bg-fiord-900">
      {!fetched && (
        <div className="flex items-center">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {fetched && (
        <div className="flex-col flex-1 min-w-full min-h-screen p-5 font-inter text-primary">
          <div className="flex flex-col avg:flex-row">
            <div className="flex-none mb-2 avg:pr-2 avg:mr-auto avg:mb-0">
              <p className="text-lg font-extrabold leading-none tracking-wider text-center sm:text-xl md:text-2xl lg:text-3xl avg:text-5xl avg:text-left">
                KERALA COVID-19 DASHBOARD
              </p>
              <div className="pt-1 leading-tight text-center sm:pt-0 text-mobile sm:text-sm avg:text-left">
                <div>
                  <p className="inline font-semibold">Last Updated: </p>
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
          <div className="flex flex-col mt-4 avg:flex-row">
            <div className="flex flex-col pl-0 avg:pl-2 avg:w-1/3">
              <Map
                districts={latest}
                summary={summary}
                maxActive={maxActive}
                hotspots={hotspots}
              />
            </div>
            <div className="flex flex-col order-last pr-0 avg:order-first avg:pr-2 avg:w-2/3">
              <Charts data={chartData} />
              <Table districts={latest} summary={summary} />
            </div>
          </div>
          <div className="flex flex-col mt-4 avg:flex-row">
            <div className="flex flex-col avg:w-3/4 avg:pr-2">
              <Hotspots hotspots={hotspots} />
            </div>
            <div className="flex flex-col mt-4 avg:flex-row avg:w-1/4 avg:pl-2 avg:mt-0">
              <div className="flex flex-col min-w-full space-y-4">
                <Testing testReport={testReport} />
                <Links />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default hot(module)(App);
