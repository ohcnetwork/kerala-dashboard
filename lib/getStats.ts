import camelcaseKeys from "camelcase-keys";

import { Districts } from "./constants";
import { sumObjectsByKey } from "./utils";

export async function getHistories(): Promise<Stats.HistoriesJSON> {
  const res = await fetch("https://keralastats.coronasafe.live/histories.json");
  const histories = await res.json();
  return camelcaseKeys(histories, { deep: true });
}

export async function getHotspotsHistories(): Promise<
  Stats.HotspotHistoriesJSON
> {
  const res = await fetch(
    "https://keralastats.coronasafe.live/hotspots_histories.json"
  );
  const histories = await res.json();
  return camelcaseKeys(histories, { deep: true });
}

export async function getTestReports(): Promise<Stats.TestReportHistories> {
  const res = await fetch(
    "https://keralastats.coronasafe.live/testreports.json"
  );
  const { reports } = await res.json();
  return camelcaseKeys(reports, { deep: true });
}

export async function getMetaProps(): Promise<{
  lastUpdated: string;
  histories: Stats.Histories;
  districtHistories: Stats.DistrictHistories;
  hotspotsHistories: Stats.HotspotHistories;
  testReportHistories: Stats.TestReportHistories;
}> {
  const { lastUpdated, histories: districtHistories } = await getHistories();
  const { histories: hotspotsHistories } = await getHotspotsHistories();
  const testReportHistories = await getTestReports();
  const histories: Stats.Histories = districtHistories.map((i) => {
    const delta: Stats.SummaryOrDelta = sumObjectsByKey(
      ...Object.values(Districts).map((d) => i.delta[d])
    );
    const summary: Stats.SummaryOrDelta = sumObjectsByKey(
      ...Object.values(Districts).map((d) => i.summary[d])
    );
    return {
      date: i.date,
      delta,
      summary,
    };
  });
  return {
    histories,
    districtHistories,
    lastUpdated,
    hotspotsHistories,
    testReportHistories,
  };
}
