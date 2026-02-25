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
        title: "弥生時代",
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
