// ================================
// データレイヤー エントリーポイント
// ================================

// 型定義
export type {
  EraId,
  SubPeriodId,
  SubPeriod,
  ActivityType,
  ActivitySize,
  Activity,
  KeyPointType,
  KeyPoint,
  AnimationPosition,
  Description,
  Location,
  RegionId,
  DetailSection,
  DetailContent,
} from "./types";

export {
  ACTIVITY_TYPES,
  ACTIVITY_SIZES,
  KEY_POINT_TYPES,
  ANIMATION_POSITIONS,
} from "./types";

// 時代区分と地域定義
export {
  ruby,
  createRubyHTML,
  eraDefinitions,
  eraSubPeriodsByRegion,
} from "./eraDefinitions";

// アニメーション定義
export { animationComponents, animationDescriptions } from "./animations";

// ユーティリティ関数
export {
  getSubPeriods,
  getSubPeriod,
  getAllSubPeriodsForRegion,
  getEraDefinition,
  getEraByYear,
  getSubPeriodsByYear,
  getAllSubPeriodsByYear,
} from "./utils";

// 歴史データ
export { locationsData } from "./historicalData";
