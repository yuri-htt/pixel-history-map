// ================================
// 型定義
// ================================

import { eraDefinitions } from "./eraDefinitions";

export type EraId = (typeof eraDefinitions)[number]["id"];

// 小区分（サブ時代）型
export type SubPeriodId =
  | "paleolithic-jp"
  | "neolithic-jp"
  | "jomon"
  | "yayoi"
  | "kofun"
  | "asuka"
  | "nara"
  | "heian";

export type SubPeriod = {
  id: SubPeriodId | string;
  label: string;
  defaultStartYear: number;
  defaultEndYear: number | null;
};

export type EraBlock = {
  subPeriods: SubPeriod[];
};

export type RegionEraSubPeriods = Record<EraId, EraBlock>;

// アクティビティタイプの定数定義
export const ACTIVITY_TYPES = {
  HUNTING: "hunting",
  BOAR: "boar",
  DEER: "deer",
  MAKING_DOKI: "making-doki",
  GRAIN_GATHERING: "grain-gathering",
  MAKING_TATEANA_HOUSE: "making-tateana-house",
  MAKING_MADBRICK_HOUSE: "making-madbrick-house",
  PLOWING_THE_FIELD: "plowing-the-field",
  SLOWING_THE_SEEDS: "slowing-the-seeds",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

// アクティビティサイズの定数定義
export const ACTIVITY_SIZES = {
  SMALL: "small",
  NORMAL: "normal",
} as const;

export type ActivitySize = (typeof ACTIVITY_SIZES)[keyof typeof ACTIVITY_SIZES];

export type Activity = {
  type: ActivityType;
  size: ActivitySize;
  startYear: number;
  endYear: number | null;
  group?: string;
};

export type DetailSection = {
  heading: string;
  text: string;
};

export type DetailContent = {
  sections: DetailSection[];
};

// キーポイントの型定義
export const KEY_POINT_TYPES = {
  FACT: "fact",
  IMPACT: "impact",
  LIFE: "life",
  CULTURE: "culture",
} as const;

export type KeyPointType =
  (typeof KEY_POINT_TYPES)[keyof typeof KEY_POINT_TYPES];

export type KeyPoint = {
  type: KeyPointType;
  text: string;
};

// アニメーション位置の定数定義
export const ANIMATION_POSITIONS = {
  TOP: "上",
  BOTTOM: "下",
  LEFT: "左",
  RIGHT: "右",
  TOP_LEFT: "左上",
  TOP_RIGHT: "右上",
  BOTTOM_LEFT: "左下",
  BOTTOM_RIGHT: "右下",
} as const;

export type AnimationPosition =
  (typeof ANIMATION_POSITIONS)[keyof typeof ANIMATION_POSITIONS];

export type Description = {
  eraId: EraId;
  subPeriodId: SubPeriodId | string;
  title: string;
  period?: string;
  image?: string | null;
  content?: string;
  keyPoints?: KeyPoint[];
  detailContent?: DetailContent | null;
  startYear: number;
  endYear: number | null;
};

export type Location = {
  regionId: string;
  name: string;
  coordinates: [number, number];
  activities: Activity[];
  descriptions?: Description[];
  position: AnimationPosition;
};
