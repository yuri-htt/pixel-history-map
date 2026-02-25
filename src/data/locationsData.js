// 拠点データ
export const locationsData = [
  {
    name: "日本",
    coordinates: [139, 36],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: -300,
      },
      {
        type: "boar",
        size: "small",
        startYear: -14000,
        endYear: -300,
      },
      {
        type: "making-doki",
        size: "normal",
        startYear: -14000,
        endYear: null, // nullは現在まで継続
      },
    ],
    descriptions: [
      {
        title: "縄文時代",
        content:
          "紀元前14000年ごろから紀元前900年ごろまで、日本では縄文時代という、とても長い時代が続きました。\n\n森や海のめぐみを分けてもらいながら、人びとは自然といっしょにくらしていました。\n\n1万年以上も続いた、世界でもめずらしい時代です。",
        startYear: -14000,
        endYear: -900,
      },
      {
        title: "弥生時代",
        content: "それ以降は弥生時代",
        startYear: -900,
        endYear: null,
      },
    ],
    position: "右下",
  },
  {
    name: "中国",
    coordinates: [110, 35],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "boar",
        size: "small",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "making-doki",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
    ],
    position: "上",
  },
  {
    name: "メソポタミア",
    coordinates: [44, 33],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "boar",
        size: "small",
        startYear: -14000,
        endYear: null,
      },
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
    name: "エジプト",
    coordinates: [31, 26],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "boar",
        size: "small",
        startYear: -14000,
        endYear: null,
      },
    ],
    position: "左下",
  },
  {
    name: "インド",
    coordinates: [78, 22],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "boar",
        size: "small",
        startYear: -14000,
        endYear: null,
      },
    ],
    position: "下",
  },
  {
    name: "ヨーロッパ",
    coordinates: [10, 50],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "boar",
        size: "small",
        startYear: -14000,
        endYear: null,
      },
    ],
    position: "上",
  },
  {
    name: "アメリカ",
    coordinates: [-95, 38],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -14000,
        endYear: null,
      },
      {
        type: "boar",
        size: "small",
        startYear: -14000,
        endYear: null,
      },
    ],
    position: "上",
  },
];

// アニメーションコンポーネントのマッピング
export const animationComponents = {
  hunting: "hunting-animation",
  boar: "boar-animation",
  "making-doki": "making-doki-animation",
  "grain-gathering": "grain-gathering-animation",
  "making-house": "making-house-animation",
};
