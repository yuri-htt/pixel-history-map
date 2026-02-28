// ================================
// 0) ルビ（ふりがな）ユーティリティ
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
// 1) 時代区分の定義（唯一の正）
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

// ================================
// 4) locationsData（現状のまま + 型だけ追加）
// ================================

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
  group?: string; // グループ名（オプショナル）
};

type DetailSection = {
  heading: string;
  text: string;
};

type DetailContent = {
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
  subPeriodId: SubPeriodId | string; // サブ時代ID（必須）
  title: string;
  period?: string;
  image?: string | null;
  content?: string;
  keyPoints?: KeyPoint[]; // キーポイント（オプショナル）
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
  // ✅ 日本列島（縄文文化圏）
  {
    regionId: "japaneseArchipelago",
    name: "日本列島",
    coordinates: [139, 36],
    activities: [
      { type: "hunting", size: "normal", startYear: -30000, endYear: -300 },
      { type: "boar", size: "small", startYear: -30000, endYear: -300 },
      {
        type: "making-doki",
        size: "normal",
        startYear: -14000,
        endYear: -300,
      },
      {
        type: "making-tateana-house",
        size: "normal",
        startYear: -14000,
        endYear: 1200,
      },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "jomon",
        title: "縄文時代",
        period: "紀元前14000年〜紀元前900年",
        image: "/landscape-of-jomon.png",
        content: "",
        keyPoints: [
          {
            type: "fact",
            text: "縄目の文様がついた土器が作られた",
          },
          {
            type: "life",
            text: `${ruby("狩", "か")}りや漁、${ruby("採集", "さいしゅう")}で食べ物を得ていた`,
          },
          {
            type: "impact",
            text: "1万年以上続いた世界的にも長い時代",
          },
        ],
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
    ],
    position: "下",
  },

  // ✅ 黄河流域
  {
    regionId: "yellowRiver",
    name: "黄河流域",
    coordinates: [112, 35],
    activities: [
      // 初期：狩猟・採集（農耕が広がる前も含めて）
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: -5000,
        group: "狩猟採取",
      },
      {
        type: "deer",
        size: "small",
        startYear: -14000,
        endYear: -5000,
        group: "狩猟採取",
      },

      // 初期新石器〜：雑穀（アワ）栽培が広がる
      {
        type: "slowing-the-seeds",
        size: "normal",
        startYear: -8000,
        endYear: -3000,
        group: "農業",
      },
      {
        type: "plowing-the-field",
        size: "normal",
        startYear: -8000,
        endYear: -3000,
        group: "農業",
      },

      // 初期新石器〜：土器（煮炊き・保存）
      {
        type: "making-doki",
        size: "small",
        startYear: -8000,
        endYear: -1900,
        group: "土器作り",
      },

      // 仰韶〜：ブタなどの家畜（飼育）
      // {
      //   type: "animal-domestication-pig",
      //   size: "normal",
      //   startYear: -5000,
      //   endYear: -3000,
      // },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "earlyNeolithic",
        title: "初期新石器時代",
        period: "紀元前8000年〜紀元前5000年ごろ",
        image: null,
        content:
          "黄河のまわりでは、少しずつ同じ場所に長く住む人が増えていきました。木の実や狩りだけでなく、アワなどの作物を育てるくらしがはじまります。土器を使って食べものをにたり、保存したりする工夫も広がりました。自然の力を利用しながら、村のくらしが形づくられていった時代です。",
        keyPoints: [
          { type: "impact", text: "作物を育てはじめた" },
          { type: "life", text: "村でくらしはじめた" },
          { type: "culture", text: "土器を使いはじめた" },
        ],
        detailContent: {
          sections: [
            {
              heading: "作物を育てる",
              text: "黄河流域ではアワなどの穀物を育てる人びとがあらわれました。食べものを自分たちで増やすという新しい考え方が広がります。",
            },
            {
              heading: "村のはじまり",
              text: "同じ場所に長く住むことで、小さな村ができました。家をつくり、みんなで協力してくらしていました。",
            },
            {
              heading: "土器の役わり",
              text: "土器を使うことで、食べものをにたり、保存したりできるようになりました。くらしは少しずつ安定していきました。",
            },
          ],
        },
        startYear: -8000,
        endYear: -5000,
      },
      {
        eraId: "prehistoric",
        subPeriodId: "yangshaoCulture",
        title: ruby("仰韶", "ぎょうしょう") + "文化",
        period: "紀元前5000年〜紀元前3000年ごろ",
        image: null,
        content:
          "黄河のまわりで、村に住んで畑をするくらしが広がった時代です。アワなどの作物を育て、ブタなどの動物も飼うようになりました。赤い色の土器に絵やもようをえがく文化が生まれ、くらしの道具が豊かになっていきます。村どうしの交流も増えて、地域に広がるまとまりができはじめました。",
        keyPoints: [
          { type: "life", text: "村で畑をするくらしが広がった" },
          { type: "impact", text: "動物を飼って食べ物が安定した" },
          { type: "culture", text: "赤い絵付け土器が作られた" },
        ],
        detailContent: {
          sections: [
            {
              heading: "どんなくらし？",
              text: "川の近くに村を作って、同じ場所で長く暮らしました。畑でアワを育てたり、食べ物をためたりして、くらしが安定していきました。",
            },
            {
              heading: "食べものと動物",
              text: "作物だけでなく、ブタなどの動物を飼うことも増えました。狩りや採集も続けつつ、食べものの種類がふえていきます。",
            },
            {
              heading: "土器と文化",
              text: "赤い土器に絵やもようをかいたものが有名です。道具だけでなく「きれいに作る」工夫が広がり、人びとの気持ちやくらしの豊かさが見えてきます。",
            },
          ],
        },
        startYear: -5000,
        endYear: -3000,
      },
      {
        eraId: "prehistoric",
        subPeriodId: "longshanCulture",
        title: "龍山文化",
        period: "紀元前3000年ごろ〜紀元前1900年ごろ",
        image: null,
        content:
          "黄河のまわりで、村が大きくなり、まとまりが強くなっていった時代です。黒くてうすい土器など、技術の高さが目立つ道具が作られました。村をかこむ土のかべやみぞが見つかることもあり、争いへのそなえも増えます。人びとの役わりの違いがはっきりして、のちの国づくりにつながる流れが見えてきます。",
        keyPoints: [
          { type: "culture", text: "黒いうす手の土器が有名" },
          { type: "impact", text: "村が大きくなり、まとめ役が目立つ" },
          { type: "fact", text: "村を囲む土のかべやみぞが見つかる" },
        ],
        detailContent: {
          sections: [
            {
              heading: "くらしの変化",
              text: "小さな村がつながって、より大きな集まりになっていきました。畑のくらしが進み、食べものや道具をためる力も強くなります。",
            },
            {
              heading: "道具と技術",
              text: "黒くてうすい土器は、とてもきれいで作るのがむずかしい道具です。上手に作れる人や工夫が増え、くらしの技術がぐっと上がりました。",
            },
            {
              heading: "村のしくみ",
              text: "村のまわりに土のかべやみぞが作られる例があり、守りを意識した様子が見えます。人によって役わりや持ち物の差も出てきて、のちの国づくりの土台になります。",
            },
          ],
        },
        startYear: -3000,
        endYear: -1900,
      },
    ],
    position: "下",
  },

  // ✅ 肥沃な三日月地帯
  {
    regionId: "fertileCrescent",
    name: "肥沃三日月",
    coordinates: [40, 35],
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
        type: "making-madbrick-house",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "natufian",
        title: "ナトゥーフ文化",
        period: "紀元前12500年ごろ〜紀元前9500年ごろ",
        image: null,
        content:
          "この地域では、野生の麦のような草の種を集めて食べる人が増えました。季節ごとに同じ場所へ戻ることが多くなり、くらしが少しずつ「定住」に近づきます。石の道具を工夫して、食べものを集めやすくしました。のちの農耕につながる、くらしの準備が進んだ時代です。",
        keyPoints: [
          { type: "life", text: "野生の穀物を集めて食べた" },
          { type: "impact", text: "同じ場所に戻るくらしが増えた" },
          { type: "fact", text: "石の道具を工夫して使った" },
        ],
        detailContent: {
          sections: [
            {
              heading: "食べものの集め方",
              text: "野生の麦のような草の種を集めて食べました。たくさん集める工夫が増えていきます。",
            },
            {
              heading: "くらしの変化",
              text: "季節ごとに同じ場所へ戻ることが多くなりました。移動の回数が減り、落ち着いた生活へ近づきます。",
            },
            {
              heading: "次の時代への準備",
              text: "食べものを集めやすい場所を大事にする考え方が育ちました。これがのちの農耕へつながります。",
            },
          ],
        },
        startYear: -12500,
        endYear: -9500,
      },
      {
        eraId: "prehistoric",
        subPeriodId: "neolithic-fc",
        title: ruby("新石器", "しんせっき") + "文化",
        period: "紀元前10000年ごろ〜紀元前4000年ごろ",
        image: null,
        content:
          "人びとは、野生の植物を育てたり、動物といっしょにくらしたりするようになりました。食べものを「作る」ことで、村に長く住めるようになります。家を作って道具をため、くらしのしくみが整っていきました。のちの都市や文明の土台ができた時代です。",
        keyPoints: [
          { type: "impact", text: "食べものを作るくらしが広がった" },
          { type: "life", text: "村で長く住む人が増えた" },
          { type: "culture", text: "家や道具を整えてくらしが安定した" },
        ],
        detailContent: {
          sections: [
            {
              heading: "村のくらし",
              text: "同じ場所に住みつづける人が増えました。家を作り、村としてまとまってくらします。",
            },
            {
              heading: "食べものを増やす",
              text: "植物を育てたり、動物を大切に育てたりする工夫が増えました。食べものが安定すると人口も増えやすくなります。",
            },
            {
              heading: "文明の土台",
              text: "食べものと住む場所が安定すると、道具や役割が増えます。これがのちの都市のはじまりにつながります。",
            },
          ],
        },
        startYear: -10000,
        endYear: -4000,
      },
    ],
    position: "上",
  },

  // ✅ ナイル川流域
  {
    regionId: "nileValley",
    name: "ナイル流域",
    coordinates: [31, 26],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "badarian",
        title: "バダリ文化",
        period: "紀元前4400年ごろ〜紀元前4000年ごろ",
        image: null,
        content:
          "ナイル川の近くで、川の水をたよりにくらしが安定していきました。土器を作って食べものを保存し、村での生活が広がります。道具やくらしの工夫が増えて、のちの古代エジプトにつながる土台ができていきました。",
        keyPoints: [
          { type: "life", text: "川の近くで村のくらしが広がった" },
          { type: "culture", text: "土器を作って保存に使った" },
          { type: "impact", text: "のちの古代エジプトにつながる土台" },
        ],
        detailContent: {
          sections: [
            {
              heading: "川とくらし",
              text: "ナイル川のそばは水と土地に恵まれていました。川の近くに人が集まりやすくなります。",
            },
            {
              heading: "道具の工夫",
              text: "土器を使って食べものをためたり、運んだりしました。生活の工夫が増えていきます。",
            },
            {
              heading: "次の時代へ",
              text: "村が増えると、人の役割も少しずつ分かれていきます。のちの大きな社会の準備になります。",
            },
          ],
        },
        startYear: -4400,
        endYear: -4000,
      },
    ],
    position: "左下",
  },

  // ✅ インダス川流域
  {
    regionId: "indusValley",
    name: "インダス流域",
    coordinates: [68, 27],
    activities: [
      { type: "hunting", size: "normal", startYear: -14000, endYear: null },
      { type: "boar", size: "small", startYear: -14000, endYear: null },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "mehrgarh",
        title: "メヘルガル文化",
        period: "紀元前7000年ごろ〜紀元前2600年ごろ",
        image: null,
        content:
          "山のふもとに近い場所で、人びとは村を作って長くくらしました。植物を育てたり、動物といっしょにくらしたりして、食べものが安定していきます。土器や道具も増え、村の生活が少しずつ大きく育ちました。のちのインダス文明につながる大事な出発点です。",
        keyPoints: [
          { type: "impact", text: "のちのインダス文明につながる出発点" },
          { type: "life", text: "村で長くくらす人が増えた" },
          { type: "culture", text: "土器や道具が増えて生活が安定" },
        ],
        detailContent: {
          sections: [
            {
              heading: "村のくらし",
              text: "同じ場所に家を作って暮らす人が増えました。村としてまとまって生活します。",
            },
            {
              heading: "食べものの工夫",
              text: "植物を育てたり、動物を育てたりする工夫が広がります。食べものが安定すると村も大きくなります。",
            },
            {
              heading: "文明へのつながり",
              text: "村が育つと道具や役割も増えます。これがのちの大きな都市の土台になります。",
            },
          ],
        },
        startYear: -7000,
        endYear: -2600,
      },
    ],
    position: "下",
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
export function getSubPeriods(regionId: RegionId, eraId: EraId): SubPeriod[] {
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
    const beforeEnd = sp.defaultEndYear === null || year <= sp.defaultEndYear;
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
    const beforeEnd = sp.defaultEndYear === null || year <= sp.defaultEndYear;
    return afterStart && beforeEnd;
  });
}

// ================================
// 6) アニメーションコンポーネントのマッピング
// ================================
export const animationComponents: Record<ActivityType, string> = {
  hunting: "hunting-animation",
  boar: "boar-animation",
  deer: "deer-animation",
  "making-doki": "making-doki-animation",
  "grain-gathering": "grain-gathering-animation",
  "making-tateana-house": "making-tateana-house-animation",
  "making-madbrick-house": "making-madbrick-house-animation",
  "plowing-the-field": "plowing-the-field-animation",
  "slowing-the-seeds": "slowing-the-seeds-animation",
};

// アニメーションの説明文
export const animationDescriptions: Record<ActivityType, string> = {
  hunting: "野生の動物を狩って食べるよ",
  boar: "逃げろー！",
  deer: "逃げろー！",
  "making-doki": "土を材料にして器を作っているよ",
  "grain-gathering": "自然に実っている穀物を集めるよ",
  "making-tateana-house": "地面を掘って家を建てるよ",
  "making-madbrick-house": "石や木で家を建てるよ",
  "plowing-the-field": "畑を耕して作物を育てるよ",
  "slowing-the-seeds": "種を蒔いて作物を育てるよ",
};
