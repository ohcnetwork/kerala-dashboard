import React, { useMemo } from "react";

import {
  SummaryLang,
  KERALA_POPULATION,
  TestReportLang,
  SummaryKeys,
  TestReportKeys,
} from "../../lib/constants";
import GraphCard from "./SubComponents/GraphCard";

type HomeSummarySectionProps = {
  histories: Stats.Histories;
  hotspotsHistories: Stats.HotspotHistories;
  testReportHistories: Stats.TestReportHistories;
};

export default function HomeSummarySection({
  histories,
  hotspotsHistories,
  testReportHistories,
}: HomeSummarySectionProps) {
  const [
    latestHistoriesIdx,
    latestHotspotsHistoriesIdx,
    latestTestReportHistoriesIdx,
  ] = useMemo(
    () => [
      histories.length - 1,
      hotspotsHistories.length - 1,
      testReportHistories.length - 1,
    ],
    []
  );

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {Object.values(SummaryKeys).map((k) => (
        <GraphCard
          key={k}
          label={SummaryLang[k]}
          value={histories[latestHistoriesIdx].summary[k]}
          delta={histories[latestHistoriesIdx].delta[k]}
          data={histories.map((f) => ({
            date: f.date,
            data: f.summary[k],
          }))}
        />
      ))}
      <GraphCard
        label="Hotspots"
        value={hotspotsHistories[latestHotspotsHistoriesIdx].hotspots.length}
        delta={
          hotspotsHistories[latestHotspotsHistoriesIdx].hotspots.length -
          hotspotsHistories[latestHotspotsHistoriesIdx - 1].hotspots.length
        }
        data={hotspotsHistories.map((f) => ({
          date: f.date,
          data: f.hotspots.length,
        }))}
      />
      <GraphCard
        label="Confirmed Per Million"
        value={
          (histories[latestHistoriesIdx].summary.confirmed /
            KERALA_POPULATION) *
          1_000_000
        }
        delta={
          (histories[latestHistoriesIdx].delta.confirmed / KERALA_POPULATION) *
          1_000_000
        }
        data={histories.map((f) => ({
          date: f.date,
          data: (f.summary.confirmed / KERALA_POPULATION) * 1_000_000,
        }))}
      />
      <GraphCard
        label="Active Ratio"
        value={
          (histories[latestHistoriesIdx].summary.active /
            histories[latestHistoriesIdx].summary.confirmed) *
          100
        }
        delta={
          (histories[latestHistoriesIdx].delta.active /
            histories[latestHistoriesIdx].delta.confirmed) *
          100
        }
        data={histories.map((f) => ({
          date: f.date,
          data: (f.summary.active / f.summary.confirmed) * 100,
        }))}
      />
      <GraphCard
        label="Recovery Ratio"
        value={
          (histories[latestHistoriesIdx].summary.recovered /
            histories[latestHistoriesIdx].summary.confirmed) *
          100
        }
        delta={
          (histories[latestHistoriesIdx].delta.recovered /
            histories[latestHistoriesIdx].delta.confirmed) *
          100
        }
        data={histories.map((f) => ({
          date: f.date,
          data: (f.summary.recovered / f.summary.confirmed) * 100,
        }))}
      />
      <GraphCard
        label="Case Fatality Ratio"
        value={
          (histories[latestHistoriesIdx].summary.deceased /
            histories[latestHistoriesIdx].summary.confirmed) *
          100
        }
        delta={
          (histories[latestHistoriesIdx].delta.deceased /
            histories[latestHistoriesIdx].delta.confirmed) *
          100
        }
        data={histories.map((f) => ({
          date: f.date,
          data: (f.summary.deceased / f.summary.confirmed) * 100,
        }))}
      />
      <GraphCard
        label="Tests Per Million"
        value={
          (testReportHistories[latestTestReportHistoriesIdx].total /
            KERALA_POPULATION) *
          1_000_000
        }
        delta={
          (testReportHistories[latestTestReportHistoriesIdx].today /
            KERALA_POPULATION) *
          1_000_000
        }
        data={testReportHistories.map((f) => ({
          date: f.date,
          data: (f.total / KERALA_POPULATION) * 1_000_000,
        }))}
      />
      <GraphCard
        label="Growth Rate"
        value={
          (histories[latestHistoriesIdx].delta.confirmed /
            histories[latestHistoriesIdx].summary.confirmed) *
          100
        }
        delta={
          (histories[latestHistoriesIdx].delta.confirmed /
            histories[latestHistoriesIdx].summary.confirmed) *
            100 -
          (histories[latestHistoriesIdx - 1].delta.confirmed /
            histories[latestHistoriesIdx - 1].summary.confirmed) *
            100
        }
        data={histories.map((f) => ({
          date: f.date,
          data: (f.delta.confirmed / f.summary.confirmed) * 100,
        }))}
      />
      <GraphCard
        label="Growth Rate (Avg 7 days)"
        value={
          histories
            .slice(latestHistoriesIdx - 7, latestHistoriesIdx)
            .reduce(
              (p, c) => p + (c.delta.confirmed / c.summary.confirmed) * 100,
              0
            ) / 7
        }
        delta={
          histories
            .slice(latestHistoriesIdx - 7, latestHistoriesIdx)
            .reduce(
              (p, c) => p + (c.delta.confirmed / c.summary.confirmed) * 100,
              0
            ) /
            7 -
          histories
            .slice(latestHistoriesIdx - 8, latestHistoriesIdx - 1)
            .reduce(
              (p, c) => p + (c.delta.confirmed / c.summary.confirmed) * 100,
              0
            ) /
            7
        }
        data={histories.map((f, i) => ({
          date: f.date,
          data:
            histories
              .slice(i - 7, i)
              .reduce(
                (p, c) => p + (c.delta.confirmed / c.summary.confirmed) * 100,
                0
              ) / 7,
        }))}
      />
      {Object.values(TestReportKeys).map((k) => (
        <GraphCard
          key={k}
          label={TestReportLang[k]}
          value={testReportHistories[latestTestReportHistoriesIdx][k]}
          delta={
            testReportHistories[latestTestReportHistoriesIdx][k] -
            testReportHistories[testReportHistories.length - 2][k]
          }
          data={testReportHistories.map((f) => ({
            date: f.date,
            data: f[k],
          }))}
        />
      ))}
    </div>
  );
}
