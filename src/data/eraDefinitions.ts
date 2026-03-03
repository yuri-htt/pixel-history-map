// ================================
// ルビ（ふりがな）ユーティリティ
// ================================

/**
 * ルビ付きテキストを生成するヘルパー関数
 * @param base - 漢字などの基底テキスト
 * @param ruby - ふりがな
 * @returns HTML rubyタグを含む文字列
 * @example ruby("仰韶", "ぎょうしょう") => "<ruby>仰韶<rt>ぎょうしょう</rt></ruby>"
 */
export function ruby(base: string, ruby: string): string {
  return `<ruby>${base}<rt>${ruby}</rt></ruby>`;
}

/**
 * ルビ付きテキストをReactで使用するためのパース関数
 * dangerouslySetInnerHTMLで使用することを想定
 */
export function createRubyHTML(text: string): { __html: string } {
  return { __html: text };
}

// ================================
// 時代区分の定義
// ================================

export const eraDefinitions = [
  {
    id: "prehistoric",
    label: "先史時代",
    startYear: -14000,
    endYear: -3000,
    description: "文字がまだ使われていない時代",
  },
  {
    id: "ancient",
    label: "古代",
    startYear: -3000,
    endYear: 500,
    description: "文明が誕生し、文字が使われ始めた時代",
  },
  {
    id: "medieval",
    label: "中世",
    startYear: 500,
    endYear: 1500,
    description: "封建制度が広がり、宗教が社会を支配した時代",
  },
  {
    id: "earlyModern",
    label: "近世",
    startYear: 1500,
    endYear: 1800,
    description: "大航海時代が始まり、世界が繋がり始めた時代",
  },
  {
    id: "modern",
    label: "近代",
    startYear: 1800,
    endYear: 1945,
    description: "産業革命により社会が大きく変化した時代",
  },
  {
    id: "contemporary",
    label: "現代",
    startYear: 1945,
    endYear: null,
    description: "情報技術が発展し、グローバル化が進んだ時代",
  },
] as const;

// ================================
// 小区分（サブ時代）定義
// ================================

import type { RegionEraSubPeriods } from "./types";

export const eraSubPeriodsByRegion = {
  japaneseArchipelago: {
    prehistoric: {
      subPeriods: [
        {
          id: "paleolithicJp",
          label: "旧石器時代",
          defaultStartYear: -30000,
          defaultEndYear: -14000,
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
          id: "yayoiPeriod",
          label: "弥生時代",
          defaultStartYear: -900,
          defaultEndYear: 250,
        },
        {
          id: "kofunPeriod",
          label: "古墳時代",
          defaultStartYear: 250,
          defaultEndYear: 600,
        },
        {
          id: "asukaPeriod",
          label: "飛鳥時代",
          defaultStartYear: 600,
          defaultEndYear: 710,
        },
        {
          id: "naraPeriod",
          label: "奈良時代",
          defaultStartYear: 710,
          defaultEndYear: 794,
        },
      ],
    },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  yellowRiver: {
    prehistoric: {
      subPeriods: [
        {
          id: "earlyNeolithic",
          label:
            ruby("初期", "しょき") +
            ruby("新石器", "しんせっき") +
            ruby("時代", "じだい"),
          defaultStartYear: -8000,
          defaultEndYear: -5000,
        },
        {
          id: "yangshao",
          label: ruby("仰韶", "ぎょうしょう") + "文化",
          defaultStartYear: -5000,
          defaultEndYear: -3000,
        },
        {
          id: "longshanCulture",
          label: ruby("龍山", "りゅうざん") + ruby("文化", "ぶんか"),
          defaultStartYear: -3000,
          defaultEndYear: -2000,
        },
      ],
    },
    ancient: {
      subPeriods: [
        {
          id: "earlyStateFormation",
          label: "初期王朝の成立",
          defaultStartYear: -2000,
          defaultEndYear: -1500,
        },
        {
          id: "zhouOrder",
          label: "周の時代",
          defaultStartYear: -1000,
          defaultEndYear: -250,
        },
        {
          id: "imperialUnificationQinHan",
          label: "統一帝国（秦漢）",
          defaultStartYear: -250,
          defaultEndYear: 200,
        },
      ],
    },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  fertileCrescent: {
    prehistoric: {
      subPeriods: [
        {
          id: "natufian",
          label: "ナトゥーフ文化",
          defaultStartYear: -12500,
          defaultEndYear: -9500,
        },
        {
          id: "neolithic-fc",
          label: ruby("新石器", "しんせっき") + "文化",
          defaultStartYear: -10000,
          defaultEndYear: -4000,
        },
      ],
    },
    ancient: {
      subPeriods: [
        {
          id: "earlyMesopotamiaStates",
          label: "初期メソポタミア",
          defaultStartYear: -3000,
          defaultEndYear: -2000,
        },
        {
          id: "babyloniaAssyriaEra",
          label: "バビロニアとアッシリア",
          defaultStartYear: -2000,
          defaultEndYear: -539,
        },
        {
          id: "achaemenidPersia",
          label: "アケメネス朝",
          defaultStartYear: -539,
          defaultEndYear: 500,
        },
      ],
    },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  nileValley: {
    prehistoric: {
      subPeriods: [
        {
          id: "badarian",
          label: "バダリ文化",
          defaultStartYear: -4400,
          defaultEndYear: -4000,
        },
      ],
    },
    ancient: {
      subPeriods: [
        {
          id: "earlyDynasticAndOldKingdom",
          label: "初期王朝〜古王国",
          defaultStartYear: -3000,
          defaultEndYear: -2181,
        },
        {
          id: "middleAndNewKingdom",
          label: "中王国〜新王国",
          defaultStartYear: -2055,
          defaultEndYear: -1070,
        },
        {
          id: "lateAndForeignRule",
          label: "末期王朝〜外来支配",
          defaultStartYear: -664,
          defaultEndYear: 500,
        },
      ],
    },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },

  indusValley: {
    prehistoric: {
      subPeriods: [
        {
          id: "mehrgarh",
          label: "メヘルガル文化",
          defaultStartYear: -7000,
          defaultEndYear: -2600,
        },
      ],
    },
    ancient: {
      subPeriods: [
        {
          id: "indusCivilization",
          label: "インダス文明",
          defaultStartYear: -2600,
          defaultEndYear: -1900,
        },
        {
          id: "postIndusTransition",
          label: "文明衰退後",
          defaultStartYear: -1900,
          defaultEndYear: 500,
        },
      ],
    },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },
} satisfies Record<string, RegionEraSubPeriods>;

export type RegionId = keyof typeof eraSubPeriodsByRegion;
