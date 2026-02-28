// ================================
// アニメーション定義
// ================================

import type { ActivityType } from "./types";

/**
 * アクティビティタイプとアニメーションコンポーネントのマッピング
 */
export const animationComponents: Record<ActivityType, string> = {
  hunting: "hunting-animation",
  boar: "boar-animation",
  deer: "deer-animation",
  "making-doki": "making-doki-animation",
  "grain-gathering": "grain-gathering-animation",
  "making-tateana-house": "making-tateana-house-animation",
  "making-mudbrick-house": "making-mudbrick-house-animation",
  "plowing-the-field": "plowing-the-field-animation",
  "sowing-the-seeds": "sowing-the-seeds-animation",
  "animal-domestication-pig": "animal-domestication-pig-animation",
  "animal-domestication-goat": "animal-domestication-goat-animation",
};

/**
 * アニメーションの説明文
 */
export const animationDescriptions: Record<ActivityType, string> = {
  hunting: "野生の動物を狩って食べるよ",
  boar: "逃げろー！",
  deer: "逃げろー！",
  "making-doki": "土を材料にして器を作っているよ",
  "grain-gathering": "自然に実っている穀物を集めるよ",
  "making-tateana-house": "地面を掘って家を建てるよ",
  "making-mudbrick-house": "石や木で家を建てるよ",
  "plowing-the-field": "畑を耕して作物を育てるよ",
  "sowing-the-seeds": "種を蒔いて作物を育てるよ",
  "animal-domestication-pig": "ブタを飼って食べ物を増やすよ",
  "animal-domestication-goat": "ヤギを飼って食べ物を増やすよ",
};
