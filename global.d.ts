declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

declare namespace Stats {
  type SummaryOrDelta = {
    hospitalObs: number;
    homeObs: number;
    totalObs: number;
    hospitalToday: number;
    confirmed: number;
    recovered: number;
    deceased: number;
    active: number;
  };

  type DistrictSummaryOrDelta = {
    Alappuzha: SummaryOrDelta;
    Ernakulam: SummaryOrDelta;
    Idukki: SummaryOrDelta;
    Kannur: SummaryOrDelta;
    Kasaragod: SummaryOrDelta;
    Kollam: SummaryOrDelta;
    Kottayam: SummaryOrDelta;
    Kozhikode: SummaryOrDelta;
    Malappuram: SummaryOrDelta;
    Palakkad: SummaryOrDelta;
    Pathanamthitta: SummaryOrDelta;
    Thiruvananthapuram: SummaryOrDelta;
    Thrissur: SummaryOrDelta;
    Wayanad: SummaryOrDelta;
  };

  type DistrictHistory = {
    summary: DistrictSummaryOrDelta;
    delta: DistrictSummaryOrDelta;
    date: string;
  };

  type History = {
    summary: SummaryOrDelta;
    delta: SummaryOrDelta;
    date: string;
  };

  type HistoriesJSON = {
    histories: DistrictHistory[];
    lastUpdated: string;
  };

  type DistrictHistories = DistrictHistory[];

  type Histories = History[];

  type Hotspot = {
    district: string;
    lsgd: string;
    wards: string;
  };

  type HotspotHistory = {
    hotspots: Hotspot[];
    date: string;
  };

  type HotspotHistoriesJSON = {
    histories: HotspotHistory[];
    lastUpdated: string;
  };

  type HotspotHistories = HotspotHistory[];

  type TestReportHistory = {
    date: string;
    total: number;
    positive: number;
    today: number;
    todayPositive: number;
  };

  type TestReportHistories = TestReportHistory[];
}
