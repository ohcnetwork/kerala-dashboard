import type { LngLat } from "mapbox-gl";
import create from "zustand";
import { combine } from "zustand/middleware";

import { SummaryKeys, Districts, MapMode, MAPBOX } from "./constants";

export const useGlobalStore = create(
  combine({ isSidebarOpen: false, lastUpdated: "" }, (set) => ({
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setLastUpdated: (updated: string) => set(() => ({ lastUpdated: updated })),
  }))
);

export const useHomeDistrictStore = create(
  combine(
    {
      selectedDistrict: Districts.Kasaragod,
      dataKey: SummaryKeys.Active,
      mapMode: MapMode.State,
    },
    (set) => ({
      setSelectedDistrict: (district: Districts) =>
        set(() => ({ selectedDistrict: district })),
      setDataKey: (dataKey: SummaryKeys) => set(() => ({ dataKey })),
      setMapMode: (mapMode: MapMode) => set(() => ({ mapMode })),
    })
  )
);

type Viewport = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type PopupEntity = null | {
  lngLat: LngLat;
  properties: GeoJSON.GeoJsonProperties;
};

type HotspotsMapStoreState = {
  viewport: Viewport;
  hoveredEntity: PopupEntity;
  geoLocEntity: GeoJSON.GeoJsonProperties;
  setViewport: (viewport: object) => void;
  setHoveredEntity: (popup: PopupEntity) => void;
  setGeoLocEntity: (properties: GeoJSON.GeoJsonProperties) => void;
};

export const useHotspotsMapStore = create<HotspotsMapStoreState>((set) => ({
  viewport: {
    latitude:
      ((MAPBOX.MAXBOUNDS[0][1] as number) +
        (MAPBOX.MAXBOUNDS[1][1] as number)) /
      2,
    longitude:
      ((MAPBOX.MAXBOUNDS[0][0] as number) +
        (MAPBOX.MAXBOUNDS[1][0] as number)) /
      2,
    zoom: MAPBOX.INIT_ZOOM,
  },
  hoveredEntity: null,
  geoLocEntity: null,
  setViewport: (viewport: Viewport) => set(() => ({ viewport })),
  setHoveredEntity: (popup) => set(() => ({ hoveredEntity: popup })),
  setGeoLocEntity: (properties) =>
    set(() => ({ geoLocEntity: properties, hoveredEntity: null })),
}));
