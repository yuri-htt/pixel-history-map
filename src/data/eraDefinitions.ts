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

  yellowRiver: {
    prehistoric: {
      subPeriods: [
        {
          id: "yangshao",
          label: ruby("仰韶", "ぎょうしょう") + "文化",
          defaultStartYear: -5000,
          defaultEndYear: -3000,
        },
      ],
    },
    ancient: { subPeriods: [] },
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
    ancient: { subPeriods: [] },
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
    ancient: { subPeriods: [] },
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
    ancient: { subPeriods: [] },
    medieval: { subPeriods: [] },
    earlyModern: { subPeriods: [] },
    modern: { subPeriods: [] },
    contemporary: { subPeriods: [] },
  },
} satisfies Record<string, RegionEraSubPeriods>;

export type RegionId = keyof typeof eraSubPeriodsByRegion;
