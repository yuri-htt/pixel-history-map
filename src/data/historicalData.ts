// ================================
// 歴史データ（ロケーション）
// ================================

import { ruby } from "./eraDefinitions";
import type { Location } from "./types";

export const locationsData: Location[] = [
  // ✅ 日本列島（縄文文化圏）
  {
    regionId: "japaneseArchipelago",
    name: "日本列島",
    displayName: ruby("日本", "にほん") + ruby("列島", "れっとう"),
    coordinates: [139, 36],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -30000,
        endYear: -900,
        group: "狩猟採取",
      },
      {
        type: "boar",
        size: "small",
        startYear: -30000,
        endYear: -900,
        group: "狩猟採取",
      },
      {
        type: "making-doki",
        size: "small",
        startYear: -14000,
        endYear: -900,
        group: "土器作り",
      },
      {
        type: "making-tateana-house",
        size: "normal",
        startYear: -14000,
        endYear: 1000,
        group: "半定住生活",
      },
      // 弥生時代
      //  "水田で稲を植えて育てる（田んぼに人が入り苗を植えるシーン）",
      // "高床倉庫に米を運んで貯蔵する（はしごのある倉庫へ運ぶシーン）",
      // "青銅器（銅鐸など）を鳴らして祭りをする（人が集まり儀礼をするシーン）"
      // 古墳時代
      //   "大きな古墳を土で盛って作る（人が土を運び盛り上げる工事シーン）",
      // "馬に乗った人が行き来して力を示す（騎馬の行列・巡回シーン）",
      // "鉄の道具や武器を作って使う（鍛冶で打つ→使うシーン）"
      // 飛鳥時代
      //   "役人が並び国のきまりを書き記す（木簡や巻物に記録するシーン）",
      // "寺の塔や堂を建てる（大工が柱を組み立てる寺院建設シーン）",
      // "使いの船が海を渡る（外国へ学びに向かう船の出航シーン）"
      // 奈良時代
      //   "碁盤の目の都で役人が行き交う（整った町並みを人が歩くシーン）",
      // "大きな寺で大仏をつくる（巨大な像を人々が協力して造るシーン）",
      // "戸籍や税の記録を書きまとめる（役人が木簡に記すシーン）"
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "jomon",
        title: ruby("縄文", "じょうもん") + ruby("時代", "じだい"),
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
            text: `${ruby("狩", "か")}りや漁、${ruby(
              "採集",
              "さいしゅう",
            )}で食べ物を得ていた`,
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
      },
      {
        eraId: "ancient",
        subPeriodId: "yayoiPeriod",
        title: "弥生時代",
        period: "紀元前900年ごろ〜西暦250年ごろ",
        image: null,
        content:
          "このころ、日本列島では米を育てるくらしが広がりました。食べ物をためられるようになり、村が大きくなっていきます。道具や作り方が地域に広がり、人のつながりも増えました。その一方で、村どうしの争いが起きることもありました。",
        keyPoints: [
          { type: "life", text: "米を育てるくらしが広がった" },
          { type: "impact", text: "食べ物をためて村が大きくなった" },
          { type: "culture", text: "祭りや道具づくりが発達した" },
        ],
        detailContent: {
          sections: [
            {
              heading: "米づくりの広がり",
              text: "水を使った田んぼで米を育てる人が増えました。食べ物が安定し、同じ場所に長く住みやすくなります。道具や作業の工夫も広がっていきました。",
            },
            {
              heading: "村の発展",
              text: "村が大きくなり、米をしまう倉庫なども作られました。人の役割が分かれ、ものを作るのが得意な人も出てきます。村どうしの交流が増え、地域のまとまりが強くなります。",
            },
            {
              heading: "祭りと争い",
              text: "みんなで集まって行う祭りや行事が大切にされました。遠くの地域とつながることで、新しい道具や考え方も入ってきます。村どうしの争いが起きた跡が見つかることもあります。",
            },
          ],
        },
      },
      {
        eraId: "ancient",
        subPeriodId: "kofunPeriod",
        title: "古墳時代",
        period: "西暦250年ごろ〜西暦600年ごろ",
        image: null,
        content:
          "このころ、日本列島では力のある人たちが大きな墓を作るようになりました。地域のまとまりが強くなり、広い範囲で人や物の行き来が増えていきます。鉄の道具が広がり、くらしや戦いの形も変わっていきました。",
        keyPoints: [
          { type: "fact", text: "大きな墓（古墳）が各地に作られた" },
          { type: "impact", text: "地域のまとまりが強くなり交流が増えた" },
          { type: "life", text: "鉄の道具が広がりくらしが変わった" },
        ],
        detailContent: {
          sections: [
            {
              heading: "大きな墓を作る",
              text: "土を盛って大きな墓を作る動きが広がりました。多くの人を集めて作れるほど、力を持つ人がいたことが分かります。作り方や形が似ている地域もあり、つながりが見えてきます。",
            },
            {
              heading: "人や物の行き来",
              text: "遠くの地域どうしでも、人や物の行き来が増えました。特に馬を使う移動が広がり、情報や道具が伝わりやすくなります。地域のまとまりも少しずつ大きくなっていきました。",
            },
            {
              heading: "鉄の道具の広がり",
              text: "鉄の道具や武器が広がり、農作業が進めやすくなりました。道具が強くなることで、生活の効率も上がっていきます。争いのしかたにも影響が出てきました。",
            },
          ],
        },
      },
      {
        eraId: "ancient",
        subPeriodId: "asukaPeriod",
        title: "飛鳥時代",
        period: "西暦600年ごろ〜西暦710年ごろ",
        image: null,
        content:
          "このころ、日本列島では国のしくみを整えようとする動きが強まりました。新しい教えや文化が海の向こうから伝わります。寺が建てられ、町のような場所もできはじめました。国としてまとまろうとする大きな変化の時代です。",
        keyPoints: [
          { type: "impact", text: "国のしくみを整える動きが進んだ" },
          { type: "culture", text: "新しい教えや文化が広がった" },
          { type: "fact", text: "寺や役所がつくられた" },
        ],
        detailContent: {
          sections: [
            {
              heading: "国づくりの始まり",
              text: "人びとをまとめるためのきまりが作られました。役目を持つ人が決まり、国の形が少しずつ整います。力のある家どうしの争いもありました。",
            },
            {
              heading: "新しい文化",
              text: "海の向こうから新しい教えや技術が伝わりました。文字を使って記録することが広がります。建物や道具の作り方も変わっていきました。",
            },
            {
              heading: "寺と都",
              text: "大きな寺が建てられ、人びとが集まる場所になりました。町のようなまとまった場所も作られます。国の中心がはっきりしてきた時代です。",
            },
          ],
        },
      },
      {
        eraId: "ancient",
        subPeriodId: "naraPeriod",
        title: "奈良時代",
        period: "西暦710年ごろ〜西暦794年ごろ",
        image: null,
        content:
          "このころ、日本列島では大きな都がつくられました。国のきまりがさらに整えられ、役人が国を動かします。大きな寺や仏像がつくられ、人びとの心のよりどころになりました。国の形がはっきりした時代です。",
        keyPoints: [
          { type: "fact", text: "大きな都がつくられた" },
          { type: "impact", text: "国のしくみが整えられた" },
          { type: "culture", text: "大きな寺や仏像が作られた" },
        ],
        detailContent: {
          sections: [
            {
              heading: "都のくらし",
              text: "まっすぐな道が並ぶ都がつくられました。役人や商人が集まり、にぎやかな町になりました。国の中心として多くの人が働いていました。",
            },
            {
              heading: "国のきまり",
              text: "人びとのくらしをまとめるためのきまりが整えられました。税や土地の管理も決められます。国を動かすしくみがはっきりしました。",
            },
            {
              heading: "寺と文化",
              text: "大きな寺や仏像がつくられました。人びとは新しい教えを大切にしました。文字や記録も広がり、文化が豊かになります。",
            },
          ],
        },
      },
    ],
    position: "下",
  },

  // ✅ 黄河流域
  {
    regionId: "yellowRiver",
    name: "黄河流域",
    displayName: ruby("黄河", "こうが") + ruby("流域", "りゅういき"),
    coordinates: [112, 35],
    activities: [
      // 初期：狩猟・採集（農耕が広がる前も含めて）
      {
        type: "hunting",
        size: "normal",
        startYear: -30000,
        endYear: -3000,
        group: "狩猟採取",
      },
      {
        type: "deer",
        size: "small",
        startYear: -30000,
        endYear: -3000,
        group: "狩猟採取",
      },

      // 初期新石器〜：雑穀（アワ）栽培が広がる
      {
        type: "sowing-the-seeds",
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
        startYear: -16000,
        endYear: -1900,
        group: "土器作り",
      },

      // 仰韶〜：ブタなどの家畜（飼育）
      {
        type: "animal-domestication-pig",
        size: "normal",
        startYear: -5000,
        endYear: -3000,
        group: "家畜飼育",
      },
      // 初期王朝の成立：earlyStateFormation
      //   "土の城壁や堀をつくって集落を守る（人が土を運び固めるシーン）",
      // "青銅の道具や武器を鋳造する（炉で金属を溶かして型に流すシーン）",
      // "占いのために骨に文字を刻む（骨に刻んで火で割れを見るシーン）"
      // 周の時代：zhouOrder
      //   "王が家来に土地を分け与える（儀式で地図や旗を渡すシーン）",
      // "戦車に乗った兵士が戦う（馬が引く車で進む戦いのシーン）",
      // "学びの場で教えを語り合う（人々が集まり話を聞くシーン）"
      // 統一帝国（秦漢）：imperialUnificationQinHan
      //   "広い土地を一つにまとめて命令を出す（王の前に人々が並ぶシーン）",
      // "長い城壁を人々が協力して築く（石や土を運び積み上げるシーン）",
      // "同じ形の文字や道具を全国で使う（役人が同じ文字を書くシーン）"
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "earlyNeolithic",
        title:
          ruby("初期", "しょき") +
          ruby("新石器", "しんせっき") +
          ruby("時代", "じだい"),
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
      },
      {
        eraId: "prehistoric",
        subPeriodId: "longshanCulture",
        title: ruby("龍山", "りゅうざん") + ruby("文化", "ぶんか"),
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
      },
      {
        eraId: "ancient",
        subPeriodId: "earlyStateFormation",
        title: "国家のはじまり",
        period: "紀元前2000年ごろ〜紀元前1500年ごろ",
        image: null,
        content:
          "黄河のまわりでは、大きな集落が生まれ、人びとをまとめる中心ができていきました。守りのための土の壁や堀が作られ、争いに備える動きも見えます。青銅の道具が広がり、くらしや戦いの力が強くなりました。人びとを動かすしくみが少しずつ形になります。",
        keyPoints: [
          { type: "impact", text: "人びとをまとめる中心が生まれた" },
          { type: "fact", text: "土の壁や堀で集落を守る例がある" },
          { type: "culture", text: "青銅の道具や占いの習わしが広がった" },
        ],
        detailContent: {
          sections: [
            {
              heading: "大きな集落へ",
              text: "村が大きくなり、中心となる場所ができました。指示を出す人や、仕事を分け合うしくみが少しずつ増えます。人の集まりが強くまとまっていきました。",
            },
            {
              heading: "守りと争い",
              text: "集落のまわりに土の壁や堀を作る例が見つかっています。外からの攻撃に備える意識が高まったと考えられます。道具や武器も工夫されました。",
            },
            {
              heading: "道具と考え方",
              text: "青銅で作った道具が広がり、仕事の効率が上がりました。占いのために骨に印をつけるような習わしも見えます。人びとの考え方や決め方が形になっていきます。",
            },
          ],
        },
      },
      {
        eraId: "ancient",
        subPeriodId: "zhouOrder",
        title: "周の時代",
        period: "紀元前1000年ごろ〜紀元前250年ごろ",
        image: null,
        content:
          "このころ、黄河のまわりでは王を中心に広い地域をまとめるしくみが作られました。王は土地を分けて、家来たちに治めさせます。やがて多くの国が生まれ、争いも増えていきました。その中で、人の生き方や社会のあり方を考える教えも広がりました。",
        keyPoints: [
          { type: "impact", text: "広い地域をまとめるしくみができた" },
          { type: "fact", text: "多くの国が生まれ争いが続いた" },
          { type: "culture", text: "人の生き方を考える教えが広がった" },
        ],
        detailContent: {
          sections: [
            {
              heading: "土地を分けるしくみ",
              text: "王は信頼する人に土地を任せました。それぞれが自分の地域を治めます。広い土地をまとめるための工夫でした。",
            },
            {
              heading: "争いの時代",
              text: "時がたつと、力を持つ国どうしが争うようになります。戦いの方法も工夫されました。多くの人が不安な時代を生きました。",
            },
            {
              heading: "考え方の広がり",
              text: "人はどう生きるべきか、国はどうあるべきかを考える動きが広がります。学ぶ人や教える人が現れました。後の時代に大きな影響を与えます。",
            },
          ],
        },
      },
      {
        eraId: "ancient",
        subPeriodId: "imperialUnificationQinHan",
        title: "統一の時代",
        period: "紀元前200年ごろ〜西暦200年ごろ",
        image: null,
        content:
          "このころ、黄河のまわりでは広い土地が一つにまとめられました。これまで分かれていた国々が、同じきまりのもとで動きます。文字や道具の形がそろえられ、人や物の行き来がしやすくなりました。大きな国が長く続く土台がつくられた時代です。",
        keyPoints: [
          { type: "impact", text: "広い土地が一つにまとめられた" },
          { type: "fact", text: "文字や道具の形がそろえられた" },
          { type: "life", text: "人や物の行き来が広がった" },
        ],
        detailContent: {
          sections: [
            {
              heading: "広い国の誕生",
              text: "多くの地域が一つにまとめられました。中心から命令が出され、各地がそれに従います。大きな国としての形が整いました。",
            },
            {
              heading: "きまりをそろえる",
              text: "文字や道具の形、はかり方などがそろえられました。同じやり方を使うことで、交流がしやすくなります。国全体が動きやすくなりました。",
            },
            {
              heading: "道と守り",
              text: "道が整えられ、人や物が遠くまで運ばれました。外からの攻撃を防ぐための壁も築かれます。大きな国を守る工夫が続きました。",
            },
          ],
        },
      },
    ],
    position: "下",
  },

  // ✅ 肥沃な三日月地帯メソポタミア
  {
    regionId: "fertileCrescent",
    name: "肥沃三日月",
    displayName: ruby("肥沃", "ひよく") + ruby("三日月", "みかづき"),
    coordinates: [40, 35],
    activities: [
      {
        type: "hunting",
        size: "normal",
        startYear: -30000,
        endYear: -4000,
        group: "狩猟採取",
      },
      {
        type: "deer",
        size: "small",
        startYear: -30000,
        endYear: -4000,
        group: "狩猟採取",
      },
      // ナトゥーフ〜前期新石器の「野生の穀物あつめ」
      {
        type: "grain-gathering",
        size: "normal",
        startYear: -12500,
        endYear: -9000,
        group: "穀物集め",
      },
      // 新石器：農業（小麦・大麦）
      {
        type: "sowing-the-seeds",
        size: "normal",
        startYear: -10000,
        endYear: -4000,
        group: "農業",
      },
      {
        type: "plowing-the-field",
        size: "normal",
        startYear: -10000,
        endYear: -4000,
        group: "農業",
      },
      {
        type: "animal-domestication-goat",
        size: "normal",
        startYear: -9000,
        endYear: -4000,
        group: "家畜飼育",
      },
      {
        type: "making-mudbrick-house",
        size: "normal",
        startYear: -9000,
        endYear: -4000,
        group: "定住生活",
      },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "natufian",
        title: "ナトゥーフ" + ruby("文化", "ぶんか"),
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
      },
    ],
    position: "上",
  },

  // ✅ ナイル川流域
  {
    regionId: "nileValley",
    name: "ナイル流域",
    displayName: "ナイル" + ruby("流域", "りゅういき"),
    coordinates: [31, 26],
    activities: [
      // 狩猟（ナイル沿いの野生動物）
      {
        type: "hunting",
        size: "normal",
        startYear: -30000,
        endYear: -3100,
        group: "狩猟採取",
      },
      {
        type: "deer",
        size: "small",
        startYear: -30000,
        endYear: -3100,
        group: "狩猟採取",
      },
      // 小麦・大麦の農耕（肥沃三日月の影響）
      {
        type: "sowing-the-seeds",
        size: "normal",
        startYear: -5000,
        endYear: -3100,
        group: "農業",
      },
      {
        type: "plowing-the-field",
        size: "normal",
        startYear: -5000,
        endYear: -3100,
        group: "農業",
      },
      // ヤギ・ヒツジの家畜化
      {
        type: "animal-domestication-goat",
        size: "normal",
        startYear: -5000,
        endYear: -3100,
        group: "家畜飼育",
      },
      // 土器文化（バダリ文化の特徴）
      {
        type: "making-doki",
        size: "normal",
        startYear: -4400,
        endYear: -4000,
        group: "土器作り",
      },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "badarian",
        title: "バダリ" + ruby("文化", "ぶんか"),
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
      },
    ],
    position: "左下",
  },

  // ✅ インダス川流域
  {
    regionId: "indusValley",
    name: "インダス流域",
    displayName: "インダス" + ruby("流域", "りゅういき"),
    coordinates: [68, 27],
    activities: [
      // 狩猟（農耕開始後も継続）
      {
        type: "hunting",
        size: "normal",
        startYear: -30000,
        endYear: -2600,
        group: "狩猟採取",
      },
      {
        type: "deer",
        size: "small",
        startYear: -30000,
        endYear: -2600,
        group: "狩猟採取",
      },
      // 小麦・大麦農耕
      {
        type: "sowing-the-seeds",
        size: "normal",
        startYear: -7000,
        endYear: -2600,
        group: "農業",
      },
      {
        type: "plowing-the-field",
        size: "normal",
        startYear: -7000,
        endYear: -2600,
        group: "農業",
      },
      // ヤギ家畜化
      {
        type: "animal-domestication-goat",
        size: "normal",
        startYear: -7000,
        endYear: -2600,
        group: "家畜飼育",
      },
      // 日干しレンガ建築（都市前段階）
      {
        type: "making-mudbrick-house",
        size: "normal",
        startYear: -6500,
        endYear: -2600,
        group: "定住生活",
      },
    ],
    descriptions: [
      {
        eraId: "prehistoric",
        subPeriodId: "mehrgarh",
        title: "メヘルガル" + ruby("文化", "ぶんか"),
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
      },
    ],
    position: "下",
  },

  // ✅ 西ヨーロッパ（中世の拠点）
  {
    regionId: "westernEuropeLatinChristendom",
    name: "西欧キリスト督圏",
    displayName:
      ruby("西欧", "せいおう") +
      ruby("キリスト", "きりすと") +
      ruby("督圏", "とっけん"),
    coordinates: [5, 48],
    activities: [],
    descriptions: [],
    position: "左上",
  },

  // ✅ イスラーム文明圏（中世の拠点）
  {
    regionId: "islamicWorldCore",
    name: "イスラーム圏",
    displayName: "イスラーム" + ruby("圏", "けん"),
    coordinates: [45, 33],
    activities: [],
    descriptions: [],
    position: "左",
  },

  // ✅ 東アジア文明圏（中世の拠点）
  {
    regionId: "eastAsiaCivilizationSphere",
    name: "東アジア圏",
    displayName: ruby("東", "ひがし") + "アジア",
    coordinates: [115, 35],
    activities: [],
    descriptions: [],
    position: "右上",
  },

  // ✅ ユーラシア草原地帯（中世の拠点）
  {
    regionId: "steppeEurasia",
    name: "ユーラ草原",
    displayName: ruby("ユーラ", "ゆーら") + ruby("草原", "そうげん"),
    coordinates: [80, 45],
    activities: [],
    descriptions: [],
    position: "上",
  },

  // ✅ 大西洋世界（近世の拠点）
  {
    regionId: "atlanticWorld",
    name: "大西洋圏",
    displayName:
      ruby("大", "たい") +
      ruby("西", "せい") +
      ruby("洋", "よう") +
      ruby("圏", "けん"),
    coordinates: [-30, 20],
    activities: [],
    descriptions: [],
    position: "左",
  },

  // ✅ イベリア航海圏（近世の拠点）
  {
    regionId: "iberianMaritimeSphere",
    name: "イベリア航海圏",
    displayName: "イベリア" + ruby("航海", "こうかい") + ruby("圏", "けん"),
    coordinates: [-6, 39],
    activities: [],
    descriptions: [],
    position: "左上",
  },

  // ✅ インド洋交易圏（近世の拠点）
  {
    regionId: "indianOceanTrade",
    name: "印洋交易圏",
    displayName:
      ruby("印", "いん") +
      ruby("洋", "よう") +
      ruby("交易", "こうえき") +
      ruby("圏", "けん"),
    coordinates: [70, 5],
    activities: [],
    descriptions: [],
    position: "下",
  },

  // ✅ 東アジア海域（近世の拠点）
  {
    regionId: "eastAsiaMaritime",
    name: "東ア海域",
    displayName:
      ruby("東", "ひがし") + "アジア" + ruby("海", "かい") + ruby("域", "いき"),
    coordinates: [125, 25],
    activities: [],
    descriptions: [],
    position: "右",
  },

  // ✅ ブリテン諸島（近代の拠点）
  {
    regionId: "britishIslesIndustrial",
    name: "ブリテン圏",
    displayName: "ブリテン" + ruby("圏", "けん"),
    coordinates: [-2, 54],
    activities: [],
    descriptions: [],
    position: "左上",
  },

  // ✅ 大陸西ヨーロッパ（近代の拠点）
  {
    regionId: "continentalWestEurope",
    name: "大陸西欧",
    displayName: ruby("大陸", "たいりく") + ruby("西欧", "せいおう"),
    coordinates: [7, 47],
    activities: [],
    descriptions: [],
    position: "左",
  },

  // ✅ 北米東岸（近代の拠点）
  {
    regionId: "northAmericaAtlantic",
    name: "北米東岸",
    displayName:
      ruby("北", "ほく") + ruby("米", "べい") + ruby("東岸", "とうがん"),
    coordinates: [-77, 39],
    activities: [],
    descriptions: [],
    position: "右",
  },

  // ✅ 東アジア沿岸（近代の拠点）
  {
    regionId: "eastAsiaCoastal",
    name: "東ア沿岸",
    displayName: ruby("東", "ひがし") + "アジア" + ruby("沿岸", "えんがん"),
    coordinates: [125, 35],
    activities: [],
    descriptions: [],
    position: "右上",
  },

  // ✅ 北大西洋圏（現代の拠点）
  {
    regionId: "northAtlanticBloc",
    name: "北大西洋",
    displayName: ruby("北", "きた") + ruby("大西洋", "たいせいよう"),
    coordinates: [-30, 45],
    activities: [],
    descriptions: [],
    position: "上",
  },

  // ✅ 東欧〜ユーラシア内陸圏（現代の拠点）
  {
    regionId: "easternEuropeEurasiaBloc",
    name: "東欧ユーラ",
    displayName: ruby("東欧", "とうおう") + "ユーラ",
    coordinates: [40, 55],
    activities: [],
    descriptions: [],
    position: "上",
  },

  // ✅ 西ヨーロッパ統合圏（現代の拠点）
  {
    regionId: "europeanIntegrationZone",
    name: "西欧統合",
    displayName: ruby("西欧", "せいおう") + ruby("統合", "とうごう"),
    coordinates: [8, 50],
    activities: [],
    descriptions: [],
    position: "左上",
  },

  // ✅ 東アジア経済圏（現代の拠点）
  {
    regionId: "eastAsiaEconomicSphere",
    name: "東ア経済圏",
    displayName:
      ruby("東", "ひがし") +
      "アジア" +
      ruby("経済", "けいざい") +
      ruby("圏", "けん"),
    coordinates: [125, 30],
    activities: [],
    descriptions: [],
    position: "右",
  },
];
