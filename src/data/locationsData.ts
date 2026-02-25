// ================================
// 1) 時代区分の定義（唯一の正）
// ================================
export const eraDefinitions = [
  { id: "prehistoric", label: "先史時代", startYear: -14000, endYear: -3000 },
  { id: "ancient", label: "古代", startYear: -3000, endYear: 500 },
  { id: "medieval", label: "中世", startYear: 500, endYear: 1500 },
  { id: "earlyModern", label: "近世", startYear: 1500, endYear: 1800 },
  { id: "modern", label: "近代", startYear: 1800, endYear: 1945 },
  { id: "contemporary", label: "現代", startYear: 1945, endYear: null },
] as const;

export type EraId = (typeof eraDefinitions)[number]["id"];

// ================================
// 2) 小区分（サブ時代）型
// ================================
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
  id: SubPeriodId | string; // 既知のIDまたは将来追加されるID
  label: string;
  defaultStartYear: number;
  defaultEndYear: number | null;
};

type EraBlock = {
  subPeriods: SubPeriod[];
};

type RegionEraSubPeriods = Record<EraId, EraBlock>;

// ================================
// 3) 小区分（教科書準拠）マスター：拠点（regionId）ごと
// - EraId と完全に紐づく（ズレたらコンパイルエラー）
// ================================
export const eraSubPeriodsByRegion = {
  japan: {
    prehistoric: {
      subPeriods: [
        {
          id: "paleolithic-jp",
          label: "旧石器時代",
          defaultStartYear: -14000,
          defaultEndYear: -10000,
        },
        {
          id: "neolithic-jp",
          label: "新石器時代",
          defaultStartYear: -10000,
          defaultEndYear: -3000,
        },
        {
          id: "jomon",
          label: "縄文時代",
          defaultStartYear: -14000,
          defaultEndYear: -900,
        },
      ],
    },
    ancient: {
      subPeriods: [
        {
          id: "yayoi",
          label: "弥生時代",
          defaultStartYear: -900,
          defaultEndYear: 300,
        },
      ],
    },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  china: {
    prehistoric: { subPeriods: [] },
    ancient: { subPeriods: [] },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  mesopotamia: {
    prehistoric: { subPeriods: [] },
    ancient: { subPeriods: [] },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  egypt: {
    prehistoric: { subPeriods: [] },
    ancient: { subPeriods: [] },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  india: {
    prehistoric: { subPeriods: [] },
    ancient: { subPeriods: [] },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  europe: {
    prehistoric: { subPeriods: [] },
    ancient: { subPeriods: [] },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  america: {
    prehistoric: { subPeriods: [] },
    ancient: { subPeriods: [] },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },
} satisfies Record<string, RegionEraSubPeriods>;

export type RegionId = keyof typeof eraSubPeriodsByRegion;

// ================================
// 4) locationsData（現状のまま + 型だけ追加）
// ================================

// アクティビティタイプの定数定義
export const ACTIVITY_TYPES = {
  HUNTING: "hunting",
  BOAR: "boar",
  MAKING_DOKI: "making-doki",
  GRAIN_GATHERING: "grain-gathering",
  MAKING_HOUSE: "making-house",
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
};

type DetailSection = {
  heading: string;
  text: string;
};

type DetailContent = {
  sections: DetailSection[];
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
  subPeriodId: SubPeriodId | string; // サブ時代ID（必須）
  title: string;
  period?: string;
  image?: string | null;
  content: string;
  detailContent?: DetailContent | null;
  startYear: number;
  endYear: number | null;
};

export type Location = {
  regionId: RegionId;
  name: string;
  coordinates: [number, number];
  activities: Activity[];
  descriptions?: Description[];
  position: AnimationPosition;
};

export const locationsData: Location[] = [
  {
    regionId: "japan",
    name: "日本",
    coordinates: [139, 36],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: -300 },
      { type: "boar", size: "small", startYear: -14000, endYear: -300 },
      { type: "making-doki", size: "normal", startYear: -14000, endYear: null },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "jomon",
        title: "縄文時代",
        period: "紀元前14000年〜紀元前900年",
        image: "/landscape-of-jomon.png",
        content:
          "紀元前14000年ごろから紀元前900年ごろまで、日本では縄文時代という、とても長い時代が続きました。\n\n森や海のめぐみを分けてもらいながら、人びとは自然といっしょにくらしていました。\n\n1万年以上も続いた、世界でもめずらしい時代です。",
        detailContent: {
          sections: [
            {
              heading: "縄文時代とは",
              text: "縄文時代は、紀元前14000年ごろから紀元前900年ごろまで続いた、日本列島の先史時代です。この名前は、土器の表面に縄目の文様がつけられていたことに由来します。",
            },
            {
              heading: "くらしと文化",
              text: "縄文人は、狩りや漁、木の実や貝を採って生活していました。竪穴住居に住み、定住生活を送っていたことが分かっています。\n\n土器を使って食べ物を煮炊きし、保存することができるようになりました。これは世界でも最も古い部類の土器文化です。",
            },
            {
              heading: "縄文土器の特徴",
              text: "縄文土器は、その装飾の美しさで知られています。縄目の文様だけでなく、複雑な模様や立体的な装飾が施されたものもあります。\n\n時代や地域によって様々なスタイルがあり、当時の人々の美意識の高さがうかがえます。",
            },
          ],
        },
        startYear: -14000,
        endYear: -900,
      },
      {
        eraId: "ancient",
        subPeriodId: "yayoi",
        title: "弥生時代",
        period: "紀元前900年〜紀元後300年",
        content: "それ以降は弥生時代",
        detailContent: {
          sections: [
            {
              heading: "弥生時代の始まり",
              text: "紀元前900年ごろから、稲作が始まり、弥生時代へと移行していきました。",
            },
          ],
        },
        startYear: -900,
        endYear: 300,
      },
    ],
    position: "右下",
  },
  {
    regionId: "china",
    name: "中国",
    coordinates: [110, 35],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
      { type: "making-doki", size: "normal", startYear: -14000, endYear: null },
    ],
    position: "上",
  },
  {
    regionId: "mesopotamia",
    name: "メソポタミア",
    coordinates: [44, 33],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
      {
        type: "grain-gathering",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "making-house",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
    ],
    position: "上",
  },
  {
    regionId: "egypt",
    name: "エジプト",
    coordinates: [31, 26],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
    ],
    position: "左下",
  },
  {
    regionId: "india",
    name: "インド",
    coordinates: [78, 22],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
    ],
    position: "下",
  },
  {
    regionId: "europe",
    name: "ヨーロッパ",
    coordinates: [10, 50],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
    ],
    position: "上",
  },
  {
    regionId: "america",
    name: "アメリカ",
    coordinates: [-95, 38],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
    ],
    position: "上",
  },
];

// ================================
// 5) ユーティリティ関数
// ================================

/**
 * 指定した地域と時代区分のサブ時代一覧を取得
 * @param regionId - 地域ID（例: "japan", "china"）
 * @param eraId - 時代区分ID（例: "prehistoric", "ancient"）
 * @returns サブ時代の配列
 */
export function getSubPeriods(
  regionId: RegionId,
  eraId: EraId,
): SubPeriod[] {
  return eraSubPeriodsByRegion[regionId][eraId].subPeriods;
}

/**
 * 指定した地域、時代区分、サブ時代IDから詳細情報を取得
 * @param regionId - 地域ID
 * @param eraId - 時代区分ID
 * @param subPeriodId - サブ時代ID
 * @returns サブ時代の詳細情報、見つからない場合はundefined
 */
export function getSubPeriod(
  regionId: RegionId,
  eraId: EraId,
  subPeriodId: SubPeriodId | string,
): SubPeriod | undefined {
  const subPeriods = getSubPeriods(regionId, eraId);
  return subPeriods.find((sp) => sp.id === subPeriodId);
}

/**
 * 指定した地域の全時代区分における全サブ時代を取得
 * @param regionId - 地域ID
 * @returns 全サブ時代の配列
 */
export function getAllSubPeriodsForRegion(regionId: RegionId): SubPeriod[] {
  const result: SubPeriod[] = [];

  // eraDefinitions を正として回す（Object.keysのキャストを避ける）
  for (const era of eraDefinitions) {
    const subPeriods = eraSubPeriodsByRegion[regionId][era.id].subPeriods;
    result.push(...subPeriods);
  }

  return result;
}

/**
 * 時代区分IDから時代区分の詳細情報を取得
 * @param eraId - 時代区分ID
 * @returns 時代区分の詳細情報、見つからない場合はundefined
 */
export function getEraDefinition(eraId: EraId) {
  return eraDefinitions.find((era) => era.id === eraId);
}

/**
 * 指定した年が属する時代区分を取得
 * @param year - 年（紀元前はマイナス）
 * @returns 該当する時代区分、見つからない場合はundefined
 */
export function getEraByYear(year: number) {
  return eraDefinitions.find((era) => {
    const afterStart = year >= era.startYear;
    const beforeEnd = era.endYear === null || year <= era.endYear;
    return afterStart && beforeEnd;
  });
}

/**
 * 指定した地域、時代区分、年から該当するサブ時代を取得
 * @param regionId - 地域ID
 * @param eraId - 時代区分ID
 * @param year - 年（紀元前はマイナス）
 * @returns 該当するサブ時代の配列
 */
export function getSubPeriodsByYear(
  regionId: RegionId,
  eraId: EraId,
  year: number,
): SubPeriod[] {
  const subPeriods = getSubPeriods(regionId, eraId);
  return subPeriods.filter((sp) => {
    const afterStart = year >= sp.defaultStartYear;
    const beforeEnd =
      sp.defaultEndYear === null || year <= sp.defaultEndYear;
    return afterStart && beforeEnd;
  });
}

/**
 * 指定した地域と年から該当するサブ時代を取得（全時代区分から検索）
 * @param regionId - 地域ID
 * @param year - 年（紀元前はマイナス）
 * @returns 該当するサブ時代の配列
 */
export function getAllSubPeriodsByYear(
  regionId: RegionId,
  year: number,
): SubPeriod[] {
  const allSubPeriods = getAllSubPeriodsForRegion(regionId);
  return allSubPeriods.filter((sp) => {
    const afterStart = year >= sp.defaultStartYear;
    const beforeEnd =
      sp.defaultEndYear === null || year <= sp.defaultEndYear;
    return afterStart && beforeEnd;
  });
}

// ================================
// 6) アニメーションコンポーネントのマッピング
// ================================
export const animationComponents: Record<ActivityType, string> = {
  hunting: "hunting-animation",
  boar: "boar-animation",
  "making-doki": "making-doki-animation",
  "grain-gathering": "grain-gathering-animation",
  "making-house": "making-house-animation",
};
