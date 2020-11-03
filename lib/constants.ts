import type { LngLatLike } from "mapbox-gl";
import type { Point } from "react-simple-maps";

export enum SummaryKeys {
  Confirmed = "confirmed",
  Active = "active",
  Recovered = "recovered",
  Deceased = "deceased",
  TotalObs = "totalObs",
  HomeObs = "homeObs",
  HospitalObs = "hospitalObs",
  HospitalToday = "hospitalToday",
}

export const SummaryLang: Partial<Record<SummaryKeys, string>> = {
  [SummaryKeys.Confirmed]: "Confirmed",
  [SummaryKeys.Active]: "Active",
  [SummaryKeys.Recovered]: "Recovered",
  [SummaryKeys.Deceased]: "Deaths",
  [SummaryKeys.TotalObs]: "Under Observation",
  [SummaryKeys.HospitalObs]: "Hospital Isolation",
  [SummaryKeys.HomeObs]: "Home Isolation",
  [SummaryKeys.HospitalToday]: "Hospitalized Today",
};

// Based on 2019 population projection by NCP report https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf
export const KERALA_POPULATION = 35_125_000;

export enum TestReportKeys {
  Total = "total",
  Positive = "positive",
  Today = "today",
  TodayPositive = "todayPositive",
}

export const TestReportLang: Partial<Record<TestReportKeys, string>> = {
  [TestReportKeys.Total]: "Total samples tested",
  [TestReportKeys.Positive]: "Total positive samples tested",
  [TestReportKeys.Today]: "Samples tested today",
  [TestReportKeys.TodayPositive]: "Samples tested positive today",
};

export enum Districts {
  Alappuzha = "alappuzha",
  Ernakulam = "ernakulam",
  Idukki = "idukki",
  Kannur = "kannur",
  Kasaragod = "kasaragod",
  Kollam = "kollam",
  Kottayam = "kottayam",
  Kozhikode = "kozhikode",
  Malappuram = "malappuram",
  Palakkad = "palakkad",
  Pathanamthitta = "pathanamthitta",
  Thiruvananthapuram = "thiruvananthapuram",
  Thrissur = "thrissur",
  Wayanad = "wayanad",
}

export const DistrictProjConfig: Partial<Record<Districts, Point>> = {
  [Districts.Kasaragod]: [75.151_474_170_448_78, 12.461_936_675_981_844],
  [Districts.Kannur]: [75.523_408_424_033_06, 12.000_475_489_056_065],
  [Districts.Wayanad]: [76.097_769_829_507_11, 11.712_581_232_597_376],
  [Districts.Kozhikode]: [75.840_122_922_841_09, 11.464_745_661_227_036],
  [Districts.Ernakulam]: [76.522_870_406_646_45, 10.078_431_722_444_25],
  [Districts.Palakkad]: [76.556_544_781_933_84, 10.795_537_251_056_414],
  [Districts.Idukki]: [77.019_723_930_082_39, 9.815_203_521_137_121],
  [Districts.Thrissur]: [76.260_917_222_688_26, 10.478_570_512_984_923],
  [Districts.Kollam]: [76.863_734_131_937_92, 8.967_720_957_425_254],
  [Districts.Kottayam]: [76.650_388_158_712_87, 9.637_955_507_126_945],
  [Districts.Pathanamthitta]: [77.091_683_418_459_65, 9.277_263_223_806_656],
  [Districts.Thiruvananthapuram]: [
    77.012_739_001_199_65,
    8.609_636_855_911_077,
  ],
  [Districts.Alappuzha]: [76.447_292_988_803_43, 9.428_053_097_388_776],
  [Districts.Malappuram]: [76.154_711_856_934_75, 11.133_664_119_337_693],
};

export enum MapMode {
  State = "state",
  District = "district",
}

export const MAPBOX = {
  ACCESS_TOKEN:
    "pk.eyJ1IjoiY29yb25hc2FmZSIsImEiOiJjazl2ODJka24wM3htM2xyMzM5dmY5aDVlIn0.6orwxCbhmIFFYRBXHcIr1w",
  INIT_ZOOM: 6.8,
  MAX_ZOOM: 14,
  LINE: {
    DARK: "#949494",
    LIGHT: "#757575",
  },
  MAXBOUNDS: [
    [71.05, 8.12],
    [81.1, 12.95],
  ] as [LngLatLike, LngLatLike],
  BASEMAP: {
    DARK: "mapbox://styles/saanu09xs/ck9vk938f10811irwhfr1gn4c",
    LIGHT: "mapbox://styles/saanu09xs/ck9w8haky07k91is3pn3dmlxj",
  },
  COLORS: {
    MAIN: "#c21313",
    ALL_WARDS: "#4f0808",
    NONE_LIGHT: "#c4c4c4",
    NONE_DARK: "#7e8080",
  },
};
